import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import formatMessage from 'format-message';

import callingOptions from 'ringcentral-integration/modules/CallingSettings/callingOptions';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import InfoIcon from '../../assets/images/Info.svg';

import styles from './styles.scss';
import i18n from './i18n';

import BackHeader from '../BackHeader';
import Panel from '../Panel';
import Switch from '../Switch';
import IconField from '../IconField';
import InputField from '../InputField';
import TextInput from '../TextInput';
import Select from '../DropdownSelect';
import SaveButton from '../SaveButton';

export default class CallingSettingsPanel extends Component {
  constructor(props) {
    super(props);
    this.defaultRingoutPrompt = props.ringoutPrompt;
    this.state = {
      callWith: props.callWith,
      ringoutPrompt: props.ringoutPrompt,
      myLocation: props.myLocation,
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.callWith !== this.props.callWith) {
      this.setState({
        callWith: newProps.callWith,
      });
    }
    if (newProps.ringoutPrompt !== this.props.ringoutPrompt) {
      this.setState({
        ringoutPrompt: newProps.ringoutPrompt,
      });
    }
    if (newProps.myLocation !== this.props.myLocation) {
      this.setState({
        myLocation: newProps.myLocation,
      });
    }
  }
  onSave = () => {
    if (typeof this.props.onSave === 'function') {
      const {
        callWith,
        myLocation,
        ringoutPrompt,
      } = this.state;
      this.props.onSave({
        callWith,
        myLocation,
        ringoutPrompt,
      });
    }
  }
  onReset = () => {
    const {
      callWith,
      myLocation,
      ringoutPrompt,
    } = this.props;
    this.setState({
      callWith,
      myLocation,
      ringoutPrompt,
    });
  }
  onCallWithChange = (callWith) => {
    if (callWith === this.props.callWith) {
      this.setState({
        callWith,
        myLocation: this.props.myLocation,
        ringoutPrompt: this.props.ringoutPrompt,
      });
      return;
    }
    this.setState({
      callWith,
      myLocation: (this.props.availableNumbers[callWith] &&
        this.props.availableNumbers[callWith][0]) ||
        '',
      ringoutPrompt: this.defaultRingoutPrompt,
    });
  }
  onMyLocationChange = (myLocation) => {
    this.setState({
      myLocation
    });
  }
  onMyLocationTextChange = (e) => {
    const myLocation = e.target.value;
    this.setState({
      myLocation
    });
  }
  onRingoutPromptChange = (checked) => {
    this.setState({
      ringoutPrompt: checked,
    });
  }

  getTooltipContent() {
    let contentKeys;
    if (this.state.callWith === callingOptions.browser
      || this.state.callWith === callingOptions.softphone
    ) {
      contentKeys = [`${this.state.callWith}Tooltip`];
    } else {
      contentKeys = [`${this.state.callWith}Tooltip`, `${this.state.callWith}Tooltip1`];
    }
    return (
      <div>
        {
          contentKeys.map(contentKey => (
            <div key={contentKey}>
              {formatMessage(
                i18n.getString(contentKey, this.props.currentLocale),
                { brand: this.props.brand }
              )}
            </div>
          ))
        }
      </div>
    );
  }

  renderHandler = (option) => {
    let { brand } = this.props;
    if (option === callingOptions.myphone) {
      brand = brand.replace(/\sPhone$/, '');
    }
    return formatMessage(i18n.getString(option, this.props.currentLocale), { brand });
  }

  render() {
    const {
      currentLocale,
      callWith,
      callWithOptions,
      myLocation,
      ringoutPrompt,
      onBackButtonClick,
      availableNumbers,
      className,
      disabled,
    } = this.props;
    const hasChanges = this.state.callWith !== callWith ||
      this.state.myLocation !== myLocation ||
      this.state.ringoutPrompt !== ringoutPrompt;
    const ringout =
      (
        this.state.callWith !== callingOptions.softphone &&
        this.state.callWith !== callingOptions.browser
      ) ? (
        <div>
          <div className={styles.ringoutHint}>
            {i18n.getString('ringoutHint', currentLocale)}
          </div>
          <InputField
            label={i18n.getString('myLocationLabel', currentLocale)}>
            {
              availableNumbers[this.state.callWith] ? (
                <Select
                  className={classnames(styles.select, styles.locationSelect)}
                  value={this.state.myLocation}
                  onChange={this.onMyLocationChange}
                  options={availableNumbers[this.state.callWith]}
                  disabled={disabled}
                  dropdownAlign="left"
                  titleEnabled
                />
              ) : (
                <TextInput
                  dataSign="myLocation"
                  value={this.state.myLocation}
                  maxLength={30}
                  onChange={this.onMyLocationTextChange} />
              )
            }
          </InputField>
          <IconField
            className={styles.iconField}
            icon={
              <Switch
                dataSign="ringoutPromptToggle"
                checked={this.state.ringoutPrompt}
                onChange={this.onRingoutPromptChange}
                />
            }
            >
            {i18n.getString('press1ToStartCallLabel', currentLocale)}
          </IconField>
        </div>
        ) : null;

    const toolTip = this.getTooltipContent();
    return (
      <div data-sign="callingSettings" className={classnames(styles.root, className)}>
        <BackHeader
          onBackClick={onBackButtonClick}
          >
          {i18n.getString('title', currentLocale)}
        </BackHeader>
        <Panel className={styles.content}>
          <InputField
            label={
              <span>
                {i18n.getString('makeCallsWith', currentLocale)}
                <Tooltip
                  placement="bottom"
                  trigger="click"
                  overlay={toolTip}
                  align={{
                    offset: [0, 47],
                  }}
                  arrowContent={<div className="rc-tooltip-arrow-inner" />}
                  getTooltipContainer={() => this.tooltipContainner}
                >
                  <InfoIcon width={14} height={14} className={styles.infoIcon} />
                </Tooltip>
              </span>
            }
            noBorder
          >
            <Select
              className={styles.select}
              value={this.state.callWith}
              onChange={this.onCallWithChange}
              options={callWithOptions}
              dropdownAlign="left"
              renderFunction={this.renderHandler}
              renderValue={this.renderHandler}
              disabled={disabled}
              titleEnabled
            />
            <div
              className={styles.tooltipContainner}
              ref={(tooltipContainner) => {
                this.tooltipContainner = tooltipContainner;
              }}
            />
          </InputField>
          {ringout}
          <SaveButton
            currentLocale={currentLocale}
            onClick={this.onSave}
            disabled={!hasChanges}
          />
        </Panel>
      </div>
    );
  }
}

CallingSettingsPanel.propTypes = {
  brand: PropTypes.string.isRequired,
  className: PropTypes.string,
  currentLocale: PropTypes.string.isRequired,
  callWithOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  callWith: PropTypes.string.isRequired,
  myLocation: PropTypes.string.isRequired,
  ringoutPrompt: PropTypes.bool.isRequired,
  availableNumbers: PropTypes.object.isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

CallingSettingsPanel.defaultProps = {
  className: null,
  disabled: false,
};
