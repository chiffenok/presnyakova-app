import React, { Component } from 'react';
import { Dropdown } from 'presnyakova-lib';
import TableContent from  './TableContent'
import './App.css';

// ### App.js with class component

// I add proxy like this to avoid CORS issue on github pages
// that's not optimum solution, as if heroku is down , users can use my app as well
// if I control the server I could add Access-Control-Allow-Origin to response header 
// Or with Node.js you can set up your own proxy
// I also read that github pages should support CORS, but somehow I didn't work
// Due to time limit I decided to go with quick solution 

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const API_URL = 'https://www.lottoland.com/api/drawings/euroJackpot/';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedDate: null,
      lotteryDates: [
        {
          id: 0,
          title: '04-09-2020',
          selected: false,
          key: 'lotteryDates',
        },
        {
          id: 1,
          title: '11-09-2020',
          selected: false,
          key: 'lotteryDates',
        },
        {
          id: 2,
          title: '18-09-2020',
          selected: false,
          key: 'lotteryDates',
        },
        {
          id: 3,
          title: '25-09-2020',
          selected: false,
          key: 'lotteryDates',
        },
      ],
      oddsData: [],
      error: null,
      isLoading: false,
    };
  }

  findSelectedDate(dates) {
    const selectedItem = dates.find(el => el.selected === true);
    return selectedItem.title.split('-').reverse().join('');
  }

  convertOddsData(data) {
    const oddsData = data;
    let convertedOddsData = [];
    for (const rank in oddsData) {
      const rankNumber = parseInt(rank.slice(4));
      if (rankNumber) {
        convertedOddsData.push({
          tier: rankNumber,
          match: 0,
          winners: oddsData[rank].winners,
          amount: oddsData[rank].prize,
        });
      }
    }
    return convertedOddsData;
  }

  fetchLotteryData() {
    this.setState({ isLoading: true });
    // See comment above about PROXY_URL
    fetch(PROXY_URL + API_URL + this.state.selectedDate)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        const convertedOddsData = this.convertOddsData(data.last[0].odds);
        this.setState({ oddsData: convertedOddsData, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  setSelectedItem = (id, key) => {
    let temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach(item => (item.selected = false));
    temp[id].selected = true;
    const selectedDate = this.findSelectedDate(temp);
    this.setState(
      {
        [key]: temp,
        selectedDate: selectedDate,
      },
      this.fetchLotteryData
    );
  };

  render() {

    const { lotteryDates, oddsData, isLoading, error } = this.state;

    return (
      <div className='App'>
        <h1>Hello, world! </h1>
        <p>Let's know the gamble data</p>
        <Dropdown
          title='Select lottery date'
          list={lotteryDates}
          onSelecting={this.setSelectedItem}
        />
        <TableContent 
          oddsData={oddsData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    );
  }
}

export default App;
