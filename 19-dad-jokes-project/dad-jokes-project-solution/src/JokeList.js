import React, { Component } from 'react';
import Joke from './Joke';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import './JokeList.css';

class JokeList extends Component {

    static defaultProps = {
        numJokeToGet: 10
    }

    constructor(props) {
        super(props);
        // Get this from localStorage if nothing is there pass in an empty array
        this.state = { jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"), loading: false };

        this.seenJokes = new Set(this.state.jokes.map(j => j.text));
        // console.log(this.seenJokes);
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount() {
        if (this.state.jokes.length === 0) this.getJokes();
    }


    async getJokes() {

        try {
            // Load Jokes 
            let jokes = [];
            while (jokes.length < this.props.numJokeToGet) {
                let res = await axios.get("https://icanhazdadjoke.com/", {
                    headers: { Accept: "application/json" }
                });

                // If you don't already have the joke push it to the jokes array
                // we do this by checking to see if the joke is in seenJokes Set
                let newJoke = res.data.joke;
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ id: uuid(), text: newJoke, votes: 0 })
                } else {
                    console.log('Found a duplicate');
                    console.log(newJoke);
                }


            }



            this.setState(st => ({
                loading: false,
                jokes: [...st.jokes, ...jokes]
            }),
                () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes)));

        } catch(err){
            alert(err);
            this.setState({loading: false});
        }
       

    }


    handleVote(id, delta) {


        /**
         * Map over the existing jokes in th state.
         * check each one if that ID is equal to the ID we are looking for
         * If it is we make a new object containing the old joke information,
         * but we up date the votes
         * Else if its not the correct one we're looking for we just add the existing joke
         * into the array 
        */
        this.setState(st => ({
            jokes: st.jokes.map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
        }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }


    handleClick() {
        this.setState({ loading: true }, this.getJokes);
    }


    render() {


        if (this.state.loading) {
            return (
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            )
        }

        // This will sort the jokes from highest to lowest based on their votes
        let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);

        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title">
                        <span>Dad</span> Jokes
                    </h1>
                    <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="laughing emoji" />
                    <button className="JokeList-getmore" onClick={this.handleClick}>Fetch Jokes</button>
                </div>
                <div className="JokeList-jokes">
                    {jokes.map(j => (
                        <Joke
                            key={j.id}
                            votes={j.votes}
                            text={j.text}
                            upvote={() => this.handleVote(j.id, 1)}
                            downvote={() => this.handleVote(j.id, -1)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}




export default JokeList;