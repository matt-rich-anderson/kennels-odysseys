import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import LocationRepository from "../../repositories/LocationRepository";
import Settings from "../../repositories/Settings";
import { fetchIt } from "../../repositories/Fetch";

export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")    
    const [isEmployee, setAuth] = useState(false)
    const [kennelLocations, setKennelLocations] = useState([])
    const [newEmployeeLocation, setNewEmployeeLocation] = useState({locationId: null})
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const history = useHistory()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        setAuth(getCurrentUser().employee)        
        resolveResource(employee, employeeId, EmployeeRepository.get)
        LocationRepository.getAll().then((data) => setKennelLocations(data))
    }, [])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {
            markLocation(resource.employeeLocations[0])
        }
    }, [resource])

    const findEmployeeLocation = (() => {
        const foundemployee = kennelLocations.find((location) => location.employeeLocations.userId === employeeId)
        return foundemployee
    })

    console.log(findEmployeeLocation())

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                    
                        ? <>
                            <section>
                                Caring for 0 animals
                            </section>                           
                            <section>
                                {isEmployee === true ?                               
                                <select 
                                    onChange={(evt) => {
                                    const copyState = {...newEmployeeLocation}
                                    copyState.locationId = parseInt(evt.target.value)
                                    copyState.userId = parseInt(employeeId)
                                    EmployeeRepository.assignEmployee(copyState)
                                        .then(() => 
                                        {
                                            const foundObject = resource?.locations?.find((user)=> user.userId === parseInt(employeeId))
                                            return fetchIt(`${Settings.remoteURL}/employeeLocations/${foundObject.id}`, "DELETE")})
                                        .then(() => history.push("/employees"))

                                }}
                                >
                                    <option>Choose a Location</option>
                                    {kennelLocations.map((location) => (<option key={location.id} id={location.id} value={location.id}>{location.name}</option>) )}
                                </select>
                                : 
                                <section>
                                   Employed at {findEmployeeLocation}
                                </section>
                                }
                            </section>
                        </>
                        : ""
                }
                {
                    isEmployee
                         ? <button className="btn--fireEmployee" onClick={() => 
                            EmployeeRepository.delete(resource.id)
                            .then(EmployeeRepository.getAll())
                            .then(() => {
                                // This was not working as intended, look into why we had to resort to history.go()
                             history.go('/employees')   
                            })
                
                        }>Fire</button>
                        : ""
                }
               

            </section>

        </article>
    )
}

