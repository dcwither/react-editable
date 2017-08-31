function withCrud(WrappedComponent) {
  return class ComponentWithCrud extends React.CreateComponent {
    static propTypes = {
      // onSubmit, onUpdate, onDelete passed in from parent (don't really care about them here)
      value: React.PropTypes.any,
      valueComparitor: React.Proptypes.func
      ..._.omit(WrappedComponent.propTypes, ['onChange', 'onSubmit', 'onCancel']),
    };

    static defaultProps = {
      valueComparitor: (a, b) => a === b
    };

    constructor(props) {
      this.state = {
        value: this.props.value
      };
    }

    // may be better for componentWillUpdate
    componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps) {
        this.setState({
          value: nextProps.value
        });
      }
    }

    handleChange = (nextValue) => {
      this.setState({
        value: nextValue
      })
    }

    handleCancel = () = {
      this.setState({
        value: this.props.value
      })
    }

    render() {
      const {value} = this.state;
      return (
        <WrappedComponent
          {..._.omit(this.props, ['value', 'valueComparitor'])}
          value={value}
          onChange={this.handleChange}
          onCancel={this.handleCancel}
        />
      );
    }
  }
}
