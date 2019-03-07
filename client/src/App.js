import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = {
    response: [],
    post: '',
    responseToPost: '',
    maximum: '',
    minimum: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({
       response: res.data,
       maximum: `0${Math.max(...res.data)}`,
       minimum: `0${Math.min(...res.data)}`
     }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    this.callApi()
      .then(res => this.setState({
        response: res.data,
        post: ''
      }))
      .catch(err => console.log(err));
  };

  ascending = () => {
    const { response } = this.state
    const sorted = response.sort()
    this.setState({ response: sorted })
  }

  descending = () => {
    const { response } = this.state
    const sorted = response.sort().reverse()
    this.setState({ response: sorted })
  }

  render() {
    return (
      <div className="App">
      <h3 className="text-title text-blue text-center mt-4 mb-4">
      random number generator
    </h3>
      <div className="text-center text-title text-capitalize text-blue">
        total numbers generated : {this.state.response.length}
      </div>
        <div className="container">
      <div className="row">
        <div className="col-10 col-md-4 mx-auto">
          <div className="card mb-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Numbers</th>
                </tr>
              </thead>
              <tbody>
                {this.state.response.map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="row">
        <form onSubmit={this.handleSubmit}  className="col-10 col-md-3 mx-auto mb-3">
          <div>
          <input
            type="text"
            className="form-control"
            placeholder="Enter value"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
            />
            <div className="col-10 col-md-4">
              <button className="btn btn-sm" type="submit">Generate</button>
            </div>
        </div>
        </form>
      </div>
      <div className="row mb-3">
        <div className="col-10 col-md-6 mx-auto">
          <div className="row">
            <div className="col-10 col-md-4">
              <button onClick={this.ascending} className="btn btn-sm">Sort Ascending</button>
            </div>
            <div className="col-10 col-md-4">
              <button onClick={this.descending} className="btn btn-sm">Sort Descending</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-10 col-md-5 text-capitalize fancy-border">
          <p>
            max number generated: {this.state.maximum}
          </p>
        </div>
        <div className="col-10 col-md-5 offset-md-1 text-capitalize fancy-border">
          <p>
            min number generated: {this.state.minimum}
          </p>
        </div>
      </div>
    </div>
      </div>
    );
  }
}

export default App;
