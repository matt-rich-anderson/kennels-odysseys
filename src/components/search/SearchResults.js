import React from "react"
import { useLocation, Link } from "react-router-dom";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import "./SearchResults.css"


export default () => {
    const location = useLocation()
    const { getCurrentUser } = useSimpleAuth()

    const displayAnimals = () => {
        if (location.state?.animals.length) {
            return (
                <React.Fragment>
                    <h2>Matching Animals</h2>
                    <section className="animals">
                        {location.state.animals.map(animal => {
                            return (
                            <li>
                                <Link className="result" to={{pathname:`animals/${animal.id}`}}>
                                    {animal.name}
                                </Link>
                            </li>
                        )
                    })}
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayEmployees = () => {
        if (location.state?.employees.length) {
            return (
                <React.Fragment>
                    <h2>Matching Employees</h2>
                    <section className="employees">
                        {location.state.employees.map(employee => {
                            return (
                                <li>
                                    <Link className="result" to={{pathname: `employees/${employee.id}`}}>
                                        {employee.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </section>
                </React.Fragment>
            )
        }
    }

    const displayLocations = () => {
        if (location.state?.locations.length) {
            return (
                <React.Fragment>
                    <h2>Matching Locations</h2>
                    <section className="locations">
                        {location.state.locations.map(location => {
                            return (
                                <li>
                                    <Link className="result" to={{pathname: `/locations/${location.id}`}}>
                                        {location.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </section>
                </React.Fragment>
            )
        }
    }

    return (
        <React.Fragment>
            <article className="searchResults">
                {getCurrentUser().employee ? displayAnimals() : ""}
                {displayEmployees()}
                {displayLocations()}
            </article>
        </React.Fragment>
    )
}
