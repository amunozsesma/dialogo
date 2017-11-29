import React from 'react';
import classNames from 'classnames';

import './button.less'

export default function Button ({className, onClick, label}) {
	const buttonClassName = classNames('button', className);

	return (
		<div className={buttonClassName} onClick={onClick}>
			{label}
		</div>
	);
}