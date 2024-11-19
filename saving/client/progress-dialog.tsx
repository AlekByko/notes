import React from 'react';
import ReactDOM from 'react-dom';

export interface ProgressDialogProps {
    progress: number | string;
}

export function thusProgressDialog() {
    return class ProgressDialog extends React.Component<ProgressDialogProps> {
        render() {
            const { progress } = this.props;
            const text = typeof progress === 'string' ? progress : (progress * 100).toFixed(1);
            return <div className="progress-dialog">{text}</div>;
        }
    };
}


if (window.sandbox === 'progress-dialog') {
    const ProgressDialog = thusProgressDialog();
    const rootElement = document.getElementById('root')!;
    ReactDOM.render(<ProgressDialog progress={0.734} />, rootElement);
}
