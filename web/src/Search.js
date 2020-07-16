import React from 'react';
import './Search.css';
import { Form, Button } from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (suggestionsList, value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : suggestionsList.filter(sugg =>
    sugg.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

export default class Search extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '', // procedure name
      suggestions: [],
      location: "",
      locationComplete: false,
      radius: 0,
      baseURL: 'https://checkuphealthcare.com' // 'http://localhost:8080'
    };
  }

  async componentWillMount() {
    // fetch from Flask and setState procedures
    console.log('fetching')
    // Imagine you have a list of suggestions that you'd like to autosuggest.
    this.setState({ suggestionsList: (await axios(this.state.baseURL + '/autocomplete/')).data.Suggestions });
    console.log(this.state.suggestionsList)
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(this.state.suggestionsList, value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // prompts user to give their location
  getLocation = async () => {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(coords => this.setState({ location: coords, locationComplete: true }));
      console.log('coordinates set')
    } else {
      alert("Your device doesn't support Current Location");
    }
  }

  submit = async () => {
    if (this.state.value === "" || this.state.location === "")
      alert("Please enter all search terms!");
    else {
      if (!('latitude' in this.state.location))
        this.setState({ coords: { coords: { latitude: 37, longitude: -122 } } })
      let data = await axios.post(this.state.baseURL + "/search/", this.state);
      this.props.display(data.data, this.state.location);
    }
  }

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Enter a DRG Code or Description',
      value,
      onChange: this.onChange
    };

    return (
      <div className="searchArea">
        <h1>Search for Medical Procedures</h1>
        <Autosuggest theme={{ input: 'searchbar', suggestion: 'suggestionItem', suggestionsList: 'listContainer' }}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        <div className="locbar">
          <input readOnly={this.state.locationComplete ? true : false} className='searchbar' placeholder="Location" onChange={e => { this.setState({ location: e.target.value }) }}></input>
          <Button onClick={this.getLocation}>Use Current Location</Button>
        </div>
        <Button disabled={this.state.location && this.state.value ? false : true} className="submit" onClick={this.submit}> Go! </Button>
      </div>
    );
  }
}