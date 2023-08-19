import telebot
import logging
from asgiref.sync import sync_to_async

from telebot import asyncio_filters
from telebot.async_telebot import AsyncTeleBot
from telebot import types
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

from telebot.asyncio_storage import StateMemoryStorage
from telebot.asyncio_handler_backends import State, StatesGroup

from telegram_app.models import support_query_model
from django.core.management.base import BaseCommand
from django.conf import settings

@sync_to_async
def save_to_db(id,chatid,text):
    support_query_model.objects.create(userid=id, chatid=chatid, text=text)
    print(f"Save answer to database: {text}")

class Command(BaseCommand):
  	# Используется как описание команды обычно
    help = 'Implemented to Django application telegram bot setup command'

    def handle(self, *args, **kwargs):        
        # Кнопки
        button_web          = InlineKeyboardButton("Наш сайт", url=settings.SITE_URL)
        button_support      = InlineKeyboardButton("Поддержка", callback_data="support")
        notification_button = InlineKeyboardButton('Уведомления', callback_data='notification')
        yes_button          = InlineKeyboardButton('Да, спасибо', callback_data='yes')
        no_button           = InlineKeyboardButton('Еще вопрос', callback_data='moreanswer')

        answer_button       = InlineKeyboardButton('Оставить запрос', callback_data='answer')
        back_button         = InlineKeyboardButton('Назад', callback_data='back')

        keybutton_main      = [[button_web], [notification_button,button_support]]
        keybutton_confirm   = [[no_button, yes_button]]
        keybutton_support   = [[answer_button], [back_button]]
        reply_markup_main   = InlineKeyboardMarkup(keybutton_main)
        reply_markup_confirm= InlineKeyboardMarkup(keybutton_confirm)
        reply_markup_support= InlineKeyboardMarkup(keybutton_support)
        
        bot = AsyncTeleBot(token=settings.TELEGRAM_BOT_TOKEN,state_storage=StateMemoryStorage())

        @bot.message_handler(commands=['cancel'])
        async def cancel(message):
            await bot.send_message(message.chat.id, "Отменено.", reply_markup=reply_markup_main)
            await bot.delete_state(message.from_user.id, message.chat.id)


        @bot.message_handler(commands=['start', 'help'])
        async def start(message):
            await bot.send_message(message.chat.id, "Здесь будут появляться уведомления о статусе вашего заказа. Вы можете связаться с Тех. Поддержкой, если у вас возникнут вопросы или сбой в системе.", reply_markup=reply_markup_main)
        @bot.callback_query_handler(state="*", func=lambda callback: callback.data == 'yes' or callback.data == 'back')
        async def start_by_button(call: types.CallbackQuery):
            await bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id, text="Здесь будут появляться уведомления о статусе вашего заказа. Вы можете связаться с Тех. Поддержкой, если у вас возникнут вопросы или сбой в системе.", reply_markup=reply_markup_main)

        @bot.callback_query_handler(state="*", func=lambda callback: callback.data == 'notification')
        async def Cancel(call: types.CallbackQuery):
            await bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id, text="Уведомления будут приходить сюда, как только статус заказа измениться", reply_markup=reply_markup_main)

        @bot.callback_query_handler(state="*", func=lambda callback: callback.data == 'moreanswer')
        async def moreanswer(call: types.CallbackQuery):
            await support(call)




        class AnswerState(StatesGroup):
            confirm_answer      = State()
            save_answer         = State()
        @bot.callback_query_handler(func=lambda callback: callback.data == 'support')
        async def support(call: types.CallbackQuery):
            await bot.set_state(call.from_user.id, AnswerState.save_answer)
            await bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id, text='Если вы не нашли информацию или хотите что-то уточнить. Свяжитесь с нашей Тех. Поддержкой в этом же чате!',reply_markup=reply_markup_support)

        @bot.callback_query_handler(func=lambda callback: callback.data == 'answer')
        async def query_answer(call: types.CallbackQuery):
            await bot.set_state(call.from_user.id, AnswerState.save_answer)
            await bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id, text='Задавай любой интересующий тебя  вопрос, мы ответим на него в скором времени!')
        
        @bot.message_handler(state=AnswerState.save_answer)
        async def save_answer(message):
            if message.text not in ['Отмена','отмена','cancel', 'Cancel', "/cancel"]:
                try:
                    await save_to_db(id=message.from_user.id,chatid=message.chat.id,text=message.text)
                    await bot.send_message(chat_id=message.chat.id, text=f"Ваш запрос:\n'''{message.text}''' \nЭто всё?", reply_markup=reply_markup_confirm)
                except:
                    await bot.send_message(chat_id=message.chat.id, text=f"На стороне бота произошла ошибка и запрос не был сохранен. Приносим извенения.", reply_markup=reply_markup_main)
                await bot.delete_state(message.from_user.id, message.chat.id)
            else:
                await bot.send_message(message.chat.id, "Отменено.", reply_markup=reply_markup_main)
                await bot.delete_state(message.from_user.id,message.chat.id)




        @bot.message_handler(func=lambda message: True)
        async def unknown(message):
            if not await bot.get_state(message.from_user.id, message.chat.id):
                await bot.send_message(message.chat.id, "Извините, но эта команда мне не известна.")

        bot.add_custom_filter(asyncio_filters.StateFilter(bot))

        print("Telegram bot started successfully. Ctrl-C to stop bot.")
        logging.basicConfig(level='INFO')
        import asyncio
        asyncio.run(bot.polling())