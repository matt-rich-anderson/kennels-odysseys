import React, { useEffect, useState } from "react"
import Settings from "../../repositories/Settings";
import { fetchIt } from "../../repositories/Fetch";
import { useHistory, useParams } from "react-router";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import OwnerRepository from "../../repositories/OwnerRepository";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import "./AnimalCard.css"

export const Animal = ({ animal, syncAnimals,
    showTreatmentHistory, owners }) => {
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isEmployee, setAuth] = useState(false)
    const [myOwners, setPeople] = useState([])
    const [allOwners, registerOwners] = useState([])
    const [classes, defineClasses] = useState("card animal")
    const [employees, setEmployees ] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()
    const { animalId } = useParams()
    const { resolveResource, resource: currentAnimal } = useResourceResolver()

    useEffect(() => {
        setAuth(getCurrentUser().employee)
        OwnerRepository.getAllEmployees().then((data) => setEmployees(data));
        resolveResource(animal, animalId, AnimalRepository.get)
    }, [])

    useEffect(() => {
        if (owners) {
            registerOwners(owners)
        }
    }, [owners])


    const getPeople = () => {
        return AnimalOwnerRepository
            .getOwnersByAnimal(currentAnimal.id)
            .then(people => setPeople(people))
    }

    useEffect(() => {
        getPeople()
    }, [currentAnimal])

    useEffect(() => {
        if (animalId) {
            defineClasses("card animal--single")
            setDetailsOpen(true)

            AnimalOwnerRepository.getOwnersByAnimal(animalId).then(d => setPeople(d))
                .then(() => {
                    OwnerRepository.getAllCustomers().then(registerOwners)
                })
        }
    }, [animalId])

    const assignCaretaker = (event) => {
        //create object
        const caretakerObject = {
            animalId: currentAnimal.id,
            userId: parseInt(event.target.value)
        }

        //post object
        fetchIt(`${Settings.remoteURL}/animalCaretakers`, "POST", JSON.stringify(caretakerObject)).then(() => history.go(0))
    }

    return (
        <>
            <li className={classes}>
                <div className="card-body">
                    <div className="animal__header">
                        <h5 className="card-title">
                            <button className="link--card btn btn-link"
                                style={{
                                    cursor: "pointer",
                                    "textDecoration": "underline",
                                    "color": "rgb(94, 78, 196)"
                                }}
                                onClick={() => {
                                    if (isEmployee) {
                                        showTreatmentHistory(currentAnimal)
                                    }
                                    else {
                                        history.push(`/animals/${currentAnimal.id}`)
                                    }
                                }}> {currentAnimal.name} </button>
                        </h5>
                        <span className="card-text small">{currentAnimal.breed}</span>
                    </div>

                    <details open={detailsOpen}>
                        <summary className="smaller">
                            <meter min="0" max="100" value={Math.random() * 100} low="25" high="75" optimum="100"></meter>
                        </summary>

                        <section>
                            <h6>Caretaker(s)</h6>
                            <span className="small">
                                {
                                    currentAnimal.animalCaretakers?.map(a => a.user.name + " ")
                                }
                            </span>

                            {
                                (isEmployee)
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={assignCaretaker} >
                                        <option value="">
                                            Select {currentAnimal.animalCaretakers?.length > 0 ? "another" : "a"} caretaker
                                        </option>
                                        {
                                            employees.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }


                            <h6>Owners</h6>
                            <span className="small">
                                {
                                    currentAnimal.animalOwners?.map(a => a.user?.name + " ")
                                }
                            </span>

                            {
                                (myOwners.length < 2 && isEmployee)
                                    ? <select defaultValue=""
                                        name="owner"
                                        className="form-control small"
                                        onChange={ e => AnimalOwnerRepository.assignOwner(currentAnimal.id, parseInt(e.target.value)).then(() => history.go(0)) } >
                                        <option value="">
                                            Select {myOwners.length === 1 ? "another" : "an"} owner
                                        </option>
                                        {
                                            allOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)
                                        }
                                    </select>
                                    : null
                            }


                            {
                                detailsOpen && "treatments" in currentAnimal
                                    ? <div className="small">
                                        <h6>Treatment History</h6>
                                        {
                                            currentAnimal.treatments.map(t => (
                                                <div key={t.id}>
                                                    <p style={{ fontWeight: "bolder", color: "grey" }}>
                                                        {new Date(t.timestamp).toLocaleString("en-US")}
                                                    </p>
                                                    <p>{t.description}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : ""
                            }

                        </section>

                        {
                            isEmployee
                                ? <button className="btn btn-warning mt-3 form-control small" onClick={() =>
                                    AnimalOwnerRepository.removeOwnersAndCaretakers(currentAnimal.id)
                                        .then(() => {AnimalRepository.delete(currentAnimal.id)}) // Remove animal
                                        .then(() => {AnimalRepository.getAll()}) // Get all animals
                                        .then(() => history.go(0))
                                }>Discharge</button>
                                : ""
                        }

                    </details>
                </div>
            </li>
        </>
    )
}
