import * as React from 'react';

const debug = require('debug')('components:validate');

interface Props {
  onChange?: (value: any) => void;
  defaultValue?: any;
}

interface State {
  error: string;
  value: string;
}

export default function validate(
  WrappedComponent: React.ReactType, // Type for react node
  validations: Array<Function>,
  options: { onChange: boolean } = {
    onChange: false,
  }
) {
  // eslint-disable-next-line react/display-name
  return class extends React.PureComponent<Props, State> {
    constructor(props: Props) {
      super(props);
      debug('constructor');

      this.state = {
        error: '',
        value: props.defaultValue || '',
      };
    }

    // Event type for input
    public handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
      evt.preventDefault();
      const { value } = evt.currentTarget;
      if (options.onChange) {
        this.setState(
          {
            value,
          },
          this.setErrors
        );
      } else {
        this.setState({
          value,
        });
      }
    };

    public reset = () => {
      this.setState({
        error: '',
        value: '',
      });
    };

    public setErrors = async () => {
      const { onChange } = this.props;
      const { value } = this.state;
      try {
        for (const validation of validations) {
          await validation(value, this.props);
        }
        this.setState({
          error: '',
        });
      } catch (err) {
        this.setState({
          error: (err as Error).message,
        });
      } finally {
        if (onChange) {
          onChange(value);
        }
      }
    };

    public setValue = async (value: any) => {
      try {
        for (const validation of validations) {
          await validation(value, this.props);
        }
        this.setState({
          error: '',
          value,
        });
        return true;
      } catch (err) {
        this.setState({
          error: (err as Error).message,
        });
        // continue throw error
        throw err;
      }
    };

    public value = async () => {
      const { value } = this.state;
      try {
        for (const validation of validations) {
          await validation(value, this.props);
        }
        this.setState({
          error: '',
        });
        return value;
      } catch (err) {
        this.setState({
          error: (err as Error).message,
        });
        // continue throw error
        throw err;
      }
    };

    public rawvalue = () => {
      const { value } = this.state;
      return value;
    };

    public render() {
      debug(`render`);

      const { value, error } = this.state;
      const { defaultValue, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          onChange={this.handleChange}
          value={value}
          error={error}
          isError={error !== ''}
        />
      );
    }
  };
}
