import React, { Component } from 'react';
import axios from 'axios';

class JokeList extends Component {

    static defaultProps = {
        numJokeToGet: 10
    }

    constructor(props) {
        super(props);
        this.state = { jokes: [] };
    }

    async componentDidMount() {
        // Load Jokes 
        let jokes = [];
        while (jokes.length < this.props.numJokeToGet) {
            let res = await axios.get("https://icanhazdadjoke.com/", {
                headers: { Accept: "application/json" }
            });
            jokes.push(res.data.joke);
        }
        this.setState({jokes: jokes});
    }

    render() {
        return (
            <div className="JokeList">
                <h1>Dad Jokes</h1>
                {this.state.jokes.map(j => (
                    <div>{j}</div>
                ))}
            </div>
        )
    }
}




export default JokeList;