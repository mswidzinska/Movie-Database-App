import React from 'react';
import './App.scss';
import Searchbar from './components/Searchbar';
import Home from './components/Home';
import Movie from './components/Movie';
import axios from 'axios';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			displayMovies: false,
			searchByTitle: '',
			moviesByName: [],
			totalResults: 0,
			searchButtonClicked: false,
			page: 1,
		};
		this.movieTitleInputHandler = this.movieTitleInputHandler.bind(this);
		this.getMoviesByTitle = this.getMoviesByTitle.bind(this);
		this.buttonPreviousPageClicked = this.buttonPreviousPageClicked.bind(this);
		this.buttonNextPageClicked = this.buttonNextPageClicked.bind(this);
		this.clear = this.clear.bind(this);
	}

	displayMovies = async () => {
		this.getMoviesByTitle();
		await this.setState({
			displayMovies: !this.state.displayMovies,
			searchButtonClicked: true,
		});
		this.clear();
	};
	clear() {
		if (this.state.searchButtonClicked === true) {
			this.setState({
				page: 1,
			});
		}
	}
	movieTitleInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			searchByTitle: e.target.value,
		});
	}

	getMoviesByTitle() {
		axios({
			method: 'GET',
			url: `https://www.omdbapi.com/?apikey=9831d2b3&s=${this.state.searchByTitle.toLowerCase()}&page=${
				this.state.page
			}`,
		})
			.then((res) => {
				this.setState({
					moviesByName: res.data.Search,
					totalResults: res.data.totalResults,
				});
			})
			.catch((err) => {
				console.log('No movies here');
			});
	}

	async buttonPreviousPageClicked() {
		await this.setState({
			page: this.state.page - 1,
		});
		this.getMoviesByTitle();
	}
	async buttonNextPageClicked() {
		await this.setState({
			page: this.state.page + 1,
		});
		this.getMoviesByTitle();
	}

	render() {
		return (
			<div className="App">
				<div className="searchbar pt-2 pb-2 shadow-sm border-top border-bottom searchbar">
					<Searchbar
						movieTitleInputHandler={this.movieTitleInputHandler}
						displayMovies={this.displayMovies}
						searchByTitle={this.state.searchByTitle}
					/>
				</div>
				<div className="App__container">
					{this.state.moviesByName === undefined ? (
						<div className="alert alert-danger mt-4" role="alert">
							{' '}
							Movie not found!
						</div>
					) : (
						<div className="content mt-4">
							{this.state.searchButtonClicked === false ? <Home /> : null}
							<Movie
								buttonPreviousPageClicked={this.buttonPreviousPageClicked}
								buttonNextPageClicked={this.buttonNextPageClicked}
								moviesByName={this.state.moviesByName}
								totalResults={this.state.totalResults}
								searchButtonClicked={this.state.searchButtonClicked}
								page={this.state.page}
								getMoviesByTitle={this.getMoviesByTitle}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
export default App;
