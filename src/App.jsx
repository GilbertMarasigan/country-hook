import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  console.log('useCountry.name', name)

  useEffect(() => {

    if (name) {
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then(countries => {
          let countryList = countries.data
          console.log('countries', countryList)

          // Ensure countryList is an array
          if (!Array.isArray(countryList)) {
            countryList = [countryList]  // Wrap object in an array if it's not already one
          }
          // get array of the object with both original and lowercase
          const countryData = countryList.map(country => ({
            original: country.name.common,
            lower: country.name.common.toLowerCase(),
            capital: country.capital,
            population: country.population,
            flag: country.flags.svg,
          }))

          const searchedList = countryData
            .filter(country => country.lower.includes(name.toLowerCase()))
            .map(country => ({
              name: country.original,
              capital: country.capital,
              population: country.population,
              flag: country.flag,
            })) // original names

          console.log('searchedList', searchedList)

          if (searchedList.length < 2) {
            // show 1 match

            // extract data
            const refinedCountry = { ...searchedList[0], found: true }
            console.log('refinedCountry', refinedCountry)

            setCountry(refinedCountry)
          }
          else {
            // if there are too many matches
            setCountry(null)
          }

        })
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div>
      <img src={country.flag} height='100' alt={`flag of ${country.name}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
    console.log('find clicked')
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App