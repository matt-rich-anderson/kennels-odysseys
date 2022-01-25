import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import LocationRepository from "../../repositories/LocationRepository";

export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")    
    const [isEmployee, setAuth] = useState(false)
    const [kennelLocations, setKennelLocations] = useState([])


    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    
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
                                <select>
                                    {kennelLocations.map((location) => (<option key={location.id} id={location.id} value={location.id}>{location.name}</option>) )}
                                </select>
                                : null
                                }
                            </section>
                        </>
                        : ""
                }

                
                {
                    <button className="btn--fireEmployee" onClick={() => {}}>Fire</button>
                }

            </section>

        </article>
    )
}

