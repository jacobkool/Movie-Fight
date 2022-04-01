const autoCompleteConfig = {
    //renders movie by getting the title, poster, and year from the API search. Fills them in using autocomplete.js
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
            `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        //searching online movie database api
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'a7111dce',
                s: searchTerm
            }
        });
        //returns an empty array if response data gives error
        if (response.data.Error) {
            return [];
        }
    
        return response.data.Search;
    }  
};


//selects left or right side for display of autocomplete, on option select it adds a class to dropdown that removes autocomplete
//also runs on movie select to display movie data
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

//declaring variables for use in function below.
let leftMovie;
let rightMovie;


//When selecting movie, do an API call with its imdbID to get movie data. Put data into movie template for formatting and HTML instertion.
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'a7111dce',
            i: movie.imdbID
        }
    });
        //pull in movie data formatted in template at bottom, insert it into summaryelement
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data
    }
        //if both sides have movie selected then run the comparison function
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

//Compare data from each side of movie, add classes that show winner and loser. Loop through the left side stats and compare them to the right side
// with the same index in their respective arrays. 
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

//Get all of the movie data, change all strings into integers and remove all non integers for comparison. 
const movieTemplate = (movieDetail) => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        //looping through and removing all not a numbers, if it is a number we add it to total from previous iterate
        const value = parseInt(word)
        if (isNaN(value)) {
            return prev;
        }   else {
            return prev + value;
        }
    }, 0);


    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"

            </p>

        </figure>
            <div class="media-content>
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>

                </div>

            </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>    
    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>    
    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>    
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>

    `
}
