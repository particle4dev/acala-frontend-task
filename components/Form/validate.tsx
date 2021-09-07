import * as React from 'react';
import {TextFieldProps} from '@material-ui/core/TextField';

const debug = require('debug')('components:validate');

type Props = Omit<TextFieldProps, 'onError'> & {
  onError: (error?: Error) => void;
}

interface State {
  error: string;
}

export default function validate(
  WrappedComponent: React.ReactType, // Type for react node
  validations: Array<Function>,
  options: { onChange: boolean } = {
    onChange: false,
  }
) {
  // eslint-disable-next-line react/display-name
  return class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);
      debug('constructor');

      this.state = {
        error: '',
      };
    }

    componentDidUpdate(prevProps: Props) {
      // Typical usage (don't forget to compare props):
      if (this.props.value !== prevProps.value) {
        this.runValidations();
      }
    }
    
    async runValidations() {
      const { value, onError } = this.props;
      try {
        for (const validation of validations) {
          await validation(value, this.props);
        }
        this.setState({
          error: '',
        });
        onError();
      } catch (err) {
        this.setState({
          error: (err as Error).message,
        });
        if(onError) {
          onError(err as Error);
        }
      }
    }

    public render() {
      debug(`render`);

      const { error } = this.state;
      const { onError, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          error={error}
          isError={error !== ''}
        />
      );
    }
  };
}
