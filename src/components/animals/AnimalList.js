import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Animal } from "./Animal";
import { AnimalDialog } from "./AnimalDialog";
import AnimalRepository from "../../repositories/AnimalRepository";
import AnimalOwnerRepository from "../../repositories/AnimalOwnerRepository";
import useModal from "../../hooks/ui/useModal";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import OwnerRepository from "../../repositories/OwnerRepository";

import "./AnimalList.css";
import "./cursor.css";
import { argv0 } from "process";

export const AnimalListComponent = (props) => {
	const [animals, petAnimals] = useState([]);
	const [animalOwners, setAnimalOwners] = useState([]);
	const [owners, updateOwners] = useState([]);
	const [animalsReady, readyAnimals] = useState(false);
	const [animalOwnersReady, readyAnimalOwners] = useState(false);
	const [currentAnimal, setCurrentAnimal] = useState({ treatments: [] });
	const [user, setUser] = useState({});
	const { getCurrentUser } = useSimpleAuth();
	const history = useHistory();
	let { toggleDialog, modalIsOpen } = useModal("#dialog--animal");

	const syncAnimals = () => {
		AnimalRepository.getAll()
			.then((data) => petAnimals(data))
			.then(() => readyAnimals(true));
	};

	useEffect(() => {
		OwnerRepository.getAllCustomers().then(updateOwners);
		AnimalOwnerRepository.getAll()
			.then(setAnimalOwners)
			.then(() => readyAnimalOwners(true));
		syncAnimals();
		setUser(getCurrentUser());
	}, []);

	useEffect(() => {
		filterAnimalsByOwner();
	}, [animalsReady, animalOwnersReady]);

	const showTreatmentHistory = (animal) => {
		setCurrentAnimal(animal);
		toggleDialog();
	};

	const filterAnimalsByOwner = () => {
		if (!user.employee) {
			const userAnimalOwnerObjects = animalOwners.filter(
				(ao) => ao.userId === user.id
			);
            if (animals.length > 0) {
			    const filteredAnimals = userAnimalOwnerObjects.map(
				    (animalOwner) => animals.find(
					    	(animal) => animal.id === animalOwner.animalId)
			    );
                petAnimals(filteredAnimals);
            }
		}
	};

	useEffect(() => {
		const handler = (e) => {
			if (e.keyCode === 27 && modalIsOpen) {
				toggleDialog();
			}
		};

		window.addEventListener("keyup", handler);

		return () => window.removeEventListener("keyup", handler);
	}, [toggleDialog, modalIsOpen]);

	return (
		<>
			<AnimalDialog toggleDialog={toggleDialog} animal={currentAnimal} />

			{getCurrentUser().employee ? (
				""
			) : (
				<div className="centerChildren btn--newResource">
					<button
						type="button"
						className="btn btn-success "
						onClick={() => {
							history.push("/animals/new");
						}}
					>
						Register Animal
					</button>
				</div>
			)}

			<ul className="animals">
				{animals.length > 0
					? animals.map((anml) => (
							<Animal
								key={`animal--${anml.id}`}
								animal={anml}
								animalOwners={animalOwners}
								owners={owners}
								syncAnimals={syncAnimals}
								setAnimalOwners={setAnimalOwners}
								showTreatmentHistory={showTreatmentHistory}
							/>
					  ))
					: null}
			</ul>
		</>
	);
};
