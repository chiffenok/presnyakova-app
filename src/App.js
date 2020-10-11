import React, { Component } from 'react';
import { Dropdown, Table } from 'presnyakova-lib';
import 'presnyakova-lib/dist/index.css';
import './App.css';

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
    fetch(`${API_URL}${this.state.selectedDate}`)
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

  renderContent(headerData) {
    const { oddsData, isLoading, error } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }
    if (oddsData.length > 0) {
      return <Table data={oddsData} dataThead={headerData} />;
    }
  }

  render() {
    const headerData = [
      {
        title: 'Tier',
      },
      {
        title: 'Match',
      },
      {
        title: 'Winners',
      },
      {
        title: 'Amount',
      },
    ];

    const { lotteryDates } = this.state;

    return (
      <div className='App'>
        <h1>Hello, world! </h1>
        <p>Let's know the gamble data</p>
        <Dropdown
          title='Select lottery date'
          list={lotteryDates}
          onSelecting={this.setSelectedItem}
        />
        {this.renderContent(headerData)}
      </div>
    );
  }
}

export default App;
