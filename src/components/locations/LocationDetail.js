import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom"
import LocationRepository from "../../repositories/LocationRepository"
import "./Location.css"


export default () => {
    const [animals, setAnimals] = useState([])
    const [employees, updateEmployees] = useState([])
    const [location, set] = useState({animals:[], employeeLocations: []})

    const { locationId } = useParams()


    useEffect(() => {
       LocationRepository.get(locationId).then(set)
    }, [locationId])

    return (
        <>
            <div className="jumbotron detailCard">
                <h1 className="display-4">{location.name}</h1>
                <p className="lead detailCard__lead">
                    Currently caring for
                    {
                        location.animals.map((a, idx, arr) =>
                            <span key={idx}>
                                {idx > 0 && ", "}
                                <Link to={`/animals/${a.id}`}> {a.name}</Link>
                            </span>
                        )
                    }
                </p>

                <hr className="my-4" />
                <p className="lead detailCard__info">
                    {
                        `We currently have ${location.employeeLocations.length}
                        well-trained animal lovers and trainers:`
                    }
                </p>
                <p className="lead detailCard__info">
                   
                   {/* Maps over employees based on location and renders names as links to individual employee modals */}
                   
                   { 
                        location.employeeLocations.map((b, idx, arr) =>
                            <span key={idx}>
                                {idx > 0 && ", "}
                                <Link to={`/employees/${b.userId}`}> {b.employee.name}</Link>
                            </span>
                    )}

                    {/* commented out loaner code */}
                    {/* {OxfordList(location.employeeLocations, "employee.name")} */}
                </p>
            </div>
        </>
    )
}
