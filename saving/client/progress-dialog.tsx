import React from 'react';

export interface ProgressDialogProps {
    progress: number;
}

export function thusProgressDialog() {
    return class ProgressDialog extends React.Component<ProgressDialogProps> {
        render() {
            const {progress} = this.props;
            return <div className="progress-dialog">
                {progress.toFixed(1)}%
            </div>;
        }
    };
}
