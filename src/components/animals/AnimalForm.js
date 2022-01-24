import React, { useState, useContext, useEffect } from "react"
import "./AnimalForm.css"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import AnimalRepository from "../../repositories/AnimalRepository";
import LocationRepository from "../../repositories/LocationRepository";
import { useHistory } from "react-router-dom"

export default (props) => {
    const [animalName, setName] = useState("")
    const [breed, setBreed] = useState("")
    const [animals, setAnimals] = useState([])
    const [employees, setEmployees] = useState([])
    const [locations, setLocations] = useState([])
    const [employeeId, setEmployeeId] = useState(0)
    const [locationId, setLocationId] = useState(0)
    const [saveEnabled, setEnabled] = useState(false)
    const history = useHistory();

    //get initial data
    useEffect(() => {
        EmployeeRepository.getAll().then(data => setEmployees(data));
        LocationRepository.getAll().then(data => setLocations(data));
    }, [])

    const constructNewAnimal = evt => {
        evt.preventDefault()
        const eId = parseInt(employeeId)
        const lId = parseInt(locationId)

        if (eId === 0) {
            window.alert("Please select a caretaker")
        } else if (lId === 0) {
            window.alert("Please select a location")
        } else {
            const emp = employees.find(e => e.id === eId)
            const loc = locations.find(l => l.id === lId)

            if (emp.employeeLocations[0].locationId === loc.id) {
                const animal = {
                    name: animalName,
                    breed: breed,
                    employeeId: eId,
                    locationId: lId
                }

                AnimalRepository.addAnimal(animal)
                    .then(() => setEnabled(true))
                    .then(() => history.push("/animals"))
                
            } else {
                window.alert("Selected employee does not work at the selected location")
            }
        }
    }

    return (
        <form className="animalForm">
            <h2>Admit Animal to a Kennel</h2>
            <div className="form-group">
                <label htmlFor="animalName">Animal name</label>
                <input
                    type="text"
                    required
                    autoFocus
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    id="animalName"
                    placeholder="Animal name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                    type="text"
                    required
                    className="form-control"
                    onChange={e => setBreed(e.target.value)}
                    id="breed"
                    placeholder="Breed"
                />
            </div>
            <div className="form-group">
                <label htmlFor="employee">Location</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setLocationId(e.target.value)}
                >
                    <option value="">Select A Location</option>
                    {locations.map(e => (
                        <option key={e.id} id={e.id} value={e.id}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="employee">Make appointment with caretaker</label>
                <select
                    defaultValue=""
                    name="employee"
                    id="employeeId"
                    className="form-control"
                    onChange={e => setEmployeeId(e.target.value)}
                >
                    <option value="">Select an employee</option>
                    {employees.map(e => (
                        <option key={e.id} id={e.id} value={e.id}>
                            {e.name} - { e.employeeLocations.map(i => locations.filter(l => l.id === i.locationId).map(l => l.name + " ")) }
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit"
                onClick={constructNewAnimal}
                disabled={saveEnabled}
                className="btn btn-primary"> Submit </button>
        </form>
    )
}
