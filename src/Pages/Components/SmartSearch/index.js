// import React from 'react'
// import Autosuggest from 'react-autosuggest'
// import './SmartSearch.css'

// import clienteAxios from '../../../config/axios';
// import tokenAuth from '../../../config/token';

// class SmartSearch extends React.Component {

//   constructor() {
//     super()
//     this.state = {
//       value: '',
//       suggestions: [],
//       items: [],
//       isLoading: false,
//     };

//     this.lastRequestId = null
//   }

//   async componentDidMount() {
//     tokenAuth(this.props.token);
//     try {
//         await clienteAxios.get('companies')
//             .then(res => this.setState({ form: res.data.company }))
//     } catch (error) {
//         console.log(error)
//     }
//     // const { url } = this.props;
//     // this.setState({ isLoading: true })
//     // fetch(API_BASE_URL + url)
//     //   .then(response => response.json())
//     //   .then(items => {
//     //     this.setState({
//     //       items,
//     //       isLoading: false
//     //     })
//     //   })
//   }

//   getMatchingLanguages(value) {

//     if (value === '') {
//       return [];
//     }

//     const regex = new RegExp('^' + value, 'i')

//     return this.state.items.filter(item => regex.test(item.name))
//   }

//   getSuggestionValue = (suggestion) => {
//     this.props.addItem(suggestion)
//     return '';
//     //return suggestion.name;
//   }

//   renderSuggestion(suggestion) {
//     return (
//       <span>{suggestion.name}</span>
//     );
//   }

//   loadSuggestions(value) {
//     // Cancel the previous request
//     if (this.lastRequestId !== null) {
//       clearTimeout(this.lastRequestId)
//     }

//     this.setState({ isLoading: true })

//     // Fake request
//     this.lastRequestId = setTimeout(() => {
//       this.setState({
//         isLoading: false,
//         suggestions: this.getMatchingLanguages(value)
//       })
//     }, 1000)
//   }

//   onChange = (event, { newValue }) => this.setState({ value: newValue })

//   onSuggestionsFetchRequested = ({ value }) => this.loadSuggestions(value)

//   onSuggestionsClearRequested = () => this.setState({ suggestions: [] })

//   render() {
//     const { value, suggestions, isLoading } = this.state
//     let { placeholder, msm } = this.props
//     const inputProps = {
//       placeholder: placeholder,
//       value,
//       onChange: this.onChange
//     }

//     const status = (isLoading ? 'Cargando...' : msm)

//     return (
//       <div>
//         <div className="status">
//           <strong>Estado:</strong> {status}
//         </div>
//         <Autosuggest
//           suggestions={suggestions}
//           onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//           onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//           getSuggestionValue={this.getSuggestionValue}
//           renderSuggestion={this.renderSuggestion}
//           inputProps={inputProps} />
//       </div>
//     )
//   }
// }

// export default SmartSearch