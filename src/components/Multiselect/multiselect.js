import React from 'react';
import './multiselect.css';

const SelectInput = ({ search }) => (
  <input className="select-input" onChange={search}/>
)

const Select = ({ selected, setIsFocused, allowMultiselect, clearSelected, search }) => (
  <div className={`select ${selected ? "" : "empty-selection"}`}
    onClick={setIsFocused}>
    {renderSelection(selected, allowMultiselect)}
    <SelectInput search={search}/>
    <div className="select-controls">
      <div className="select-clear" onClick={clearSelected}/>
      <div className="select-arrow"/>
    </div>
  </div>
);

const renderSelection = (selected, allowMultiselect) => {
  if (selected) {
    return allowMultiselect ? renderMultiSelection(selected) : renderSingleSelection(selected);
  }

  return (<div className="selection">Choose Option</div>);
};

const renderMultiSelection = ( selected ) => (
  selected.map((eachSelected) => (
    <span className="multiselection" key={eachSelected.value}>{eachSelected.label}</span>
  ))
);

const renderSingleSelection = ( selected ) => (<span className="selection">{selected.label}</span>);

const SelectOptions = ({ options, setSelected }) => (
  <div className="select-options">
    {options.map((option) => (
      <div className={`select-option ${option.selected ? "selected" : ""}`}
        key={option.value}
        onClick={() => { setSelected(option) }}>
        {option.label}
      </div>
    ))}
  </div>
);

const getSearchedOptions = (options, searchValue) => {
  return options.filter((option) => {
    if (!searchValue) return true;
    return option.label.toUpperCase().includes(searchValue.toUpperCase());
  })
};

class Multiselect extends React.Component {
  state = { 
    selected: null,
    searchValue: null,
    isFocused: false
  };

  componentDidMount() {
    // Don't want to see the options when you click out of the multiselect.
    document.addEventListener('mousedown', (event) => {
      if (!this.multiselect.contains(event.target)) {
        this.setState(() => ({
          isFocused: false
        }));
      }
    });
  };

  // Want to display the options when selecting the multiselect.
  setIsFocused = (event) => {
    // Clicking on the clear button doesn't need to force the options to show.
    if (event.target.className !== "select-clear") {
      this.setState(() => ({
        isFocused: true
      }));
    }

    // When the multiselect is selected, search should be enabled.
    setTimeout(() => {
      this.multiselect.getElementsByClassName("select-input")[0].focus();
    }, 100);
  };

  setSelected = (newSelection) => {
    const { selected } = this.state;
    const { allowMultiselect, onChange } = this.props;

    // For multiselect
    if (allowMultiselect) {
      // Make sure the multiselect is in array format.
      let multiselection = selected ? selected : [];
      const multiselectionByValue = multiselection.map((eachSelection) => eachSelection.value);

      // Want to make sure that the option selected is already selected or not.
      if (!multiselectionByValue.includes(newSelection.value)) {
        multiselection.push(newSelection);
      } else { // if the option is already selected, remove from the selected.
        multiselection = multiselection.filter((selection) => {
          return selection.value !== newSelection.value;
        });
      }
      
      if (multiselection.length === 0) multiselection = null;

      this.setState(() => ({
        selected: multiselection
      }));
      onChange(multiselection);
    } else { // for single select
      this.setState(() => ({
        selected: newSelection,
        isFocused: false
      }));
      onChange(newSelection);
    }
  }

  // Want to clear the selected when clear button has been pressed.
  clearSelected = () => {
    this.setState(() => ({
      selected: null,
      isFocused: false
    }));
  }

  // onChange text input
  search = (event) => {
    const value = event.target.value;

    this.setState(() => ({
      searchValue: value
    }));
  }

  render () {
    const {
      elements,
      allowMultiselect
    } = this.props;

    const {
      isFocused,
      selected,
      searchValue
    } = this.state;

    // Find out which options already selected
    let options = elements.map((element) => {
      // Only find this out when there are anything selected
      // And allowMultiselect
      if (selected && allowMultiselect) {
        const selectedByValue = selected.map((eachSelected) => eachSelected.value);

        element.selected = selectedByValue.includes(element.value);
      } else {
        element.selected = false;
      }

      return element;
    });

    // Filter the options by value from search
    options = getSearchedOptions(options, searchValue)

    return (
      <div ref={(element) => { this.multiselect = element; }}  className={`multiselect ${isFocused ? "is-focused" : ""}`}>
        <Select 
          selected={selected}
          setIsFocused={this.setIsFocused}
          allowMultiselect={allowMultiselect}
          clearSelected={this.clearSelected}
          search={this.search}
        />
        <SelectOptions 
          options={options}
          setSelected={this.setSelected}
        />
      </div>
    )
  };
};

export default Multiselect;