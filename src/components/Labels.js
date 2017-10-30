import Constants from './Constants';
let Labels = {};

Labels['App_Info'] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris';
Labels['App_Terms_Title'] = 'términos y condiciones de uso';
Labels['App_Terms_Content'] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

Labels['Button'] = {};
Labels['Button'][Constants.ROOM_STATE_WAITING] = 'Espera tu turno';
Labels['Button'][Constants.ROOM_STATE_ACTIVE] = 'Dialoga';
Labels['Button'][Constants.ROOM_STATE_INACTIVE] = 'Entrar en cola';

Labels['Info_Time_Left'] = 'Tiempo de palabra:';
Labels['Info_Online'] = 'En Línea:';

Labels['Room_Title'] = {};
Labels['Room_Title']['left'] = {
	bold: 'SI',
	normal: 'al independentismo'
};
Labels['Room_Title']['right'] = {
	bold: 'NO',
	normal: 'al independentismo'
};

export default Labels;