import text from './visual_strings';

export default [
    { // 0
        type: 'input',
        name: 'oscPath',
        message: text.msg_path,
    },
    { // 1
        type: 'input',
        name: 'oscArgs',
        message: text.msg_args,
    },
    { // 2
        type: 'input',
        name: 'address',
        message: text.msg_address,
    },
    { // 3
        type: 'input',
        name: 'port',
        message: text.msg_port,
    },
    { // 4
        type: 'list',
        name: 'askNext',
        message: text.msg_menu,
        choices: [
            text.SEND,
            text.PLAY_NOTE,
            text.PLAY_SONG,
            text.PLAY_SONG_BOX,
            text.PLAY_SONG_MAT,
            text.DRUMS_MENU,
            text.SETTINGS_MENU,
            text.EXIT,
        ],
    },
    { // 5
        type: 'list',
        name: 'askSettings',
        message: text.msg_settings_menu,
        choices: [
            text.CHANGE_PATH,
            text.CHANGE_ARGS,
            text.CHANGE_ADDRESS,
            text.CHANGE_PORT,
            text.BACK,
        ],
    },
    { // 6
        type: 'list',
        name: 'askDrums',
        message: text.msg_menu_drums,
        choices: [
            text.START_DRUM_LOOP,
            text.STOP_DRUM_LOOP,
            text.BACK,
        ],
    },
    { // 7
        type: 'confirm',
        name: 'anotherArg',
        message: text.msg_another_args,
        default: true,
    },
];
