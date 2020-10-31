import React from 'react';
import Select from "react-dropdown-select";
import  '../App.css';




const options =[
    { value: 'https://discord.gg/VAMwwrB', label: 'CSE110'},
    { value: 'www.google.com', label: 'Google'},
    { value: 'www.youtube.com', label: 'Youtube'}
]

function Outputs(props){
    const sidebar = (
        <ul>
            {props.options.map((option) =>
                <li key={option.id}>
                    {option.label}
                </li>
            )}
        </ul>
    )
    const content = props.options.map((option)=>
        <div key={option.id}>
            <h3>{option.label}</h3>
            <a target="_blank" href={option.value}>Invitation Link</a>

        </div>
    );
    return (
        <div>
            {content}
        </div>
    )
};

class SearchBar extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            Links: []
        };


    }



    handleOnChange = classSearched => this.setState({ Links:classSearched });
    render(){

        return(
            <div>
                <Select  className='dropdown'
                         options={options}
                         clearable={true}
                         color={'aqua'}
                         closeOnSelect={true}
                         onChange={classSearched => this.handleOnChange(classSearched)}
                         multi={true}
                />

                <Outputs options={this.state.Links}/>

            </div>





        );
    }
}

export default SearchBar;