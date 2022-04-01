//reusable autocomplete widget for APIs. 
const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
    <label><b>Search</b><label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`;

const input = root.querySelector('.input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results')

const onInput = async event => {
        const items = await fetchData(event.target.value);
        //if search returns nothing, remove the dropdown
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        resultsWrapper.innerHTML = '';
            //loops through all items returns in search and adds them into dropdown
        dropdown.classList.add('is-active')
        for (let item of items) {

            const option = document.createElement('a');
            

                //creating anchor elements with data from renderOption, as well as runs on optionSelect both to be defined in index.js
            option.classList.add('dropdown-item')
            option.innerHTML= renderOption(item);
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                input.value = inputValue(item)
                onOptionSelect(item);
            });
            //adding anchor element to dropdown
            resultsWrapper.appendChild(option);
        }
};

//debounce defined in utils.js, sets timeout for delay given. Helps not generate a GET request immediately on every single key input. 
input.addEventListener('input', debounce(onInput, 550));

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

};