import text from './visual_strings';

export default [
    {
        type: 'input',
        name: 'oscpath',
        message: text.msg_path,
    },
    {
        type: 'input',
        name: 'oscargs',
        message: text.msg_args,
    },
    {
        type: 'input',
        name: 'address',
        message: text.msg_address,
    },
    {
        type: 'input',
        name: 'port',
        message: text.msg_port,
    },
    {
        type: 'list',
        name: 'askNext',
        message: text.msg_menu,
        choices: [
            text.SEND,
            text.PLAY_NOTE,
            text.PLAY_SONG,
            text.DRUMS_MENU,
            text.SETTINGS_MENU,
            text.EXIT,
        ],
    },
    {
        type: 'list',
        name: 'asksettings',
        message: text.msg_settings_menu,
        choices: [
            text.CHANGE_PATH,
            text.CHANGE_ARGS,
            text.CHANGE_ADDRESS,
            text.CHANGE_PORT,
            text.BACK,
        ],
    },
    {
        type: 'list',
        name: 'askdrums',
        message: text.msg_menu_drums,
        choices: [
            text.START_DRUMLOOP,
            text.STOP_DRUMLOOP,
            text.BACK,
        ],
    },
];