import React, { Component } from "react";
import queryString from "query-string";
import _ from "lodash";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import SearchBox from "./searchBox";
import Pagination from "./common/pagination";
import DropDonwButtons from "./dropDownButtons";
import { deleteMovie, getMovies } from "../service/movieService";
import { getGenres } from "../service/genreService";
import { paginate } from "../utils/paginate";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "../App.css";
import { toast } from "react-toastify";
class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    selectedGenre: {},
    searchQuery: "",
    pageSize: 4,
    sortColumn: { path: "title", order: "asc" },
  };
  getQueryStrings() {
    const headersQuery = [
      { label: "Title", column: "title" },
      { label: "Genre", column: "genre.name" },
      { label: "Stock", column: "numberInStock" },
      { label: "Rate", column: "dailyRentalRate" },
    ];
    return headersQuery;
  }
  async componentDidMount() {
    const querySt = this.getQueryStrings();
    const { data: gernes } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...gernes];
    querySt.map((item) =>
      this.checkQueryString(item.label.toLowerCase(), item.column)
    );
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }
  checkQueryString = (label, path) => {
    const { history } = this.props;
    const { sort, By } = queryString.parse(history.location.search);

    if (sort === label && By === "asc") {
      this.setState({
        sortColumn: { path, order: "asc" },
      });
    } else if (sort === label && By === "desc") {
      this.setState({
        sortColumn: { path, order: "desc" },
      });
    }
  };
  handleLiked = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };
  handleDelete = async (movie) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((item) => item._id !== movie._id);
    if (this.getPageData().data.length === 1) {
      this.setState({ currentPage: this.currentPage-- });
    }
    this.setState({ movies });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("this movie has alreadt been deleted");
      }
      this.setState({ movies: originalMovies });
    }
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: "", currentPage: 1 });
  };
  handleStockOrderSetState = (pathName, order) => {
    this.setState({
      sortColumn: { path: pathName, order },
    });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      movies: allMovies,
    } = this.state;
    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: movies };
  };
  render() {
    const { length: count } = this.state.movies;
    const {
      currentPage,
      pageSize,
      genres,
      sortColumn,
      selectedGenre,
      searchQuery,
    } = this.state;
    const { totalCount, data: movies } = this.getPageData();
    const { history } = this.props;
    if (count === 0) return <p>There ar no movies in the database.</p>;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-2">
            <ListGroup
              items={genres}
              selectedItem={selectedGenre}
              onItemSelect={this.handleGenreSelect}
            />
          </div>
          <div className="col">
            <Link to="/movies/new" className="btn btn-primary">
              New Movie
            </Link>{" "}
            <p>Showing {totalCount} movies in the database.</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              movies={movies}
              sortColumn={sortColumn}
              onLike={this.handleLiked}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
          <DropDonwButtons
            getQueryStrings={this.getQueryStrings()}
            history={history}
            setChanged={this.handleStockOrderSetState}
          />{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default Movies;
