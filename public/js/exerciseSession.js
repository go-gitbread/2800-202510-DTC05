
  // Global object to store all exercise data
  const workoutData = {};
  let currentExercise = '';
  
  // Track which routine each exercise belongs to
  const exerciseToRoutineMap = {};

const mainRoutineName = window.routineData.routineName;
const mainRoutineId = window.routineData.routineId;
window.routineData.exercises.forEach(exercise => {
  workoutData[exercise] = [];
  exerciseToRoutineMap[exercise] = {
    routineName: mainRoutineName,
    routineId: mainRoutineId
  };
});

  //Function to load routines into the "Link Routines" modal
  async function loadRoutines() {
    try {
      const res = await fetch('/api/routines'); //Fetch the user's saved routines
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      //Populate the routine list with the user's routines
      const list = document.getElementById('routineList'); 
      list.innerHTML = '';
      data.forEach(routine => {
        const li = document.createElement('li');
        li.textContent = routine.routineName;
        li.style.cursor = 'pointer';
        li.onclick = () => addRoutineExercises(routine._id);
        list.appendChild(li);
      });
      //Make the Routine modal visible
      document.getElementById('routineModal').style.display = 'block';  
    } catch (err) {
      console.error('Failed to load routines:', err);
      alert('Error loading routines. Please try again.');
    }
  }
//Function to add exercises to your current session from another routine
  async function addRoutineExercises(routineId) {   //Function accepts the given routineID to grab the exercises from
    try {
      console.log('Fetching routine with ID:', routineId);
      const res = await fetch(`/api/routine/${routineId}`); //Fetch the selected routine
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();

      const exerciseList = document.getElementById('exercise-list');
      //Get the names of the exercises already listed & store them in an array 
      const existingExercises = Array.from(exerciseList.querySelectorAll('.exercise-name')).map(el => el.textContent);
      //Get the names of the new exercises to be added & store them in an array 
      const newExercises = data.exercises.filter(ex => !existingExercises.includes(ex));
      newExercises.forEach(exercise => {
      // Add to workout data tracking
        workoutData[exercise] = [];
        
        // Map this exercise to its routine
        exerciseToRoutineMap[exercise] = {
          routineName: data.routineName,
          routineId: data._id
        };
        
        const div = document.createElement('div');
        div.className = 'exercise'; 
        //Assign each exercise to trigger startExercise when clicked and pass the current exercise
        div.onclick = () => startExercise(exercise); 
        div.innerHTML = `
          <div class="icon">🏋️‍♂️</div>
          <div class="exercise-name">${exercise}</div>
          <div class="arrow">›</div>
        `;
        exerciseList.insertBefore(div, document.querySelector('.finish-btn')); //Add the new exercise to the end of the list
      });

      // Save new exercises to session
      if (newExercises.length > 0) {
        await fetch(`/api/add-exercises/<%= routine._id %>`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exercises: newExercises })
        });
      }

      closeModal();
    } catch (err) {
      console.error('Failed to add exercises:', err);
      alert('Error adding exercises. Please try again.');
    }
  }
  //Function to close the "Link Routine" modal
  function closeModal() {
    document.getElementById('routineModal').style.display = 'none'; //Hide modal when function is called
  }

  //Start Exercise: Bring user to the log form for the given exercise
  function startExercise(name) {
    currentExercise = name;
    
    // Replace the main title with the exercise name
    const titleContainer = document.getElementById('title-container');
    // Store the original HTML to restore it later
    if(!titleContainer.getAttribute('data-original-html')) {
      titleContainer.setAttribute('data-original-html', titleContainer.innerHTML);
    }
    // Set the exercise name without the link button
    titleContainer.innerHTML = name;
    
    document.getElementById('exercise-title').style.display = 'none';
    
    // Hide exercise list and show detail view
    document.getElementById('exercise-list').style.display = 'none';
    document.getElementById('exercise-detail').style.display = 'block';
    
    // Refresh the sets display based on saved data for this exercise
    refreshSetsDisplay();
  }
  //Function to display the sets for each exercise
  function refreshSetsDisplay() {
    const setsContainer = document.getElementById('sets-container');
    setsContainer.innerHTML = '';
    
    // Get the saved sets for this exercise or initialize with one empty set
    const sets = workoutData[currentExercise];
    
    if (sets && sets.length > 0) {
      // Display all saved sets
      sets.forEach((set, index) => {
        addSetToDisplay(index + 1, set.reps, set.weight);
      });
    } else {
      // Add a single empty set if none exist
      addSetToDisplay(1, '', '');
    }
  }
  //Function to display a new set in the exercise log
  function addSetToDisplay(setNumber, repsValue = '', weightValue = '') { //***We can replace these empty values with Target values
    const setsContainer = document.getElementById('sets-container');
    
    const newSet = document.createElement('div');
    newSet.className = 'set-entry';
    newSet.innerHTML = `
      <div>Set ${setNumber}</div>
      <div><input type="number" class="rep-input" value="${repsValue}" placeholder="Reps"> reps</div>
      <div><input type="number" class="weight-input" value="${weightValue}" placeholder="Weight"> lbs</div>
    `;
    
    setsContainer.appendChild(newSet);
    
    // Add event listeners to new inputs to save data whenever it has been altered
    const inputs = newSet.querySelectorAll('input');
    inputs.forEach(input => { 
      input.addEventListener('change', () => saveCurrentExerciseData()); //Save whenever the value is changed
      input.addEventListener('input', () => saveCurrentExerciseData()); //Save whenever a value is inputted
    });
  }
  //Function to add a new set in the exercise log
  function addSet() {
    const setsContainer = document.getElementById('sets-container');
    const existingSets = setsContainer.querySelectorAll('.set-entry');
    const setNumber = existingSets.length + 1; //Determine what number the next set will be
    
    addSetToDisplay(setNumber); //Call this helper function to display the new set with the new set number
    
    // Add a new empty set to the workoutData for logging 
    // **workoutData stores all the currently saved workout data**
    if (!workoutData[currentExercise]) {
      workoutData[currentExercise] = [];
    }
    workoutData[currentExercise].push({ reps: '', weight: '' });
  }
  //Function to save the reps/weight data inputted by the user 
  function saveCurrentExerciseData() {
    const setsContainer = document.getElementById('sets-container');
    const setEntries = setsContainer.querySelectorAll('.set-entry');
    
    // Clear any existing data from an earlier save
    workoutData[currentExercise] = [];
    
    // Save data from each set
    setEntries.forEach(setEntry => { //For each set...
      const repInput = setEntry.querySelector('.rep-input'); //Grab the inputted reps 
      const weightInput = setEntry.querySelector('.weight-input'); //Grab the inputted weight
      
      const reps = repInput.value.trim() ? parseInt(repInput.value) : ''; //If the input is empty, set as an empty string
      const weight = weightInput.value.trim() ? parseFloat(weightInput.value) : ''; //If the input is empty, set as an empty string
      
      workoutData[currentExercise].push({ reps, weight }); //Add the data for the current exercise to workoutData
    });
    //Log each save - useful!
    console.log('Saved data for', currentExercise, workoutData[currentExercise]);
  }
//Function to return the user from their current exercise back to the list of exercises in the session
  function finishExercise() {
    // Save current exercise data before switching
    saveCurrentExerciseData();
    
    // Restore the original title with routine name and link button
    const titleContainer = document.getElementById('title-container');
    const originalHtml = titleContainer.getAttribute('data-original-html');
    if(originalHtml) {
      titleContainer.innerHTML = originalHtml;
      // Re-bind the event listener to the link button since it gets removed when logging an exercise
      const linkButton = document.getElementById('link-routine-btn');
      if(linkButton) {
        linkButton.addEventListener('click', loadRoutines);
      }
    }
    
    // Make sure the exercise title is visible for next time
    document.getElementById('exercise-title').style.display = 'block';
    
    // Hide detail view and show exercise list
    document.getElementById('exercise-detail').style.display = 'none';
    document.getElementById('exercise-list').style.display = 'block';
    
    // Clear current exercise
    currentExercise = '';
  }
  
  // Event listener for "Link routine" button
  document.getElementById('link-routine-btn').addEventListener('click', loadRoutines); //Call loadRoutines function on click
  //Event listener for "Finish workout" Button
  document.getElementById('finish-workout-btn').addEventListener('click', async () => {
    if (currentExercise) {
      saveCurrentExerciseData();    // Save any current exercise data
    }
    // Organize data by routine
    const routinesData = {};
    
    // Filter out empty sets and organize by routine
    Object.keys(workoutData).forEach(exercise => {
      // Only include exercises that have at least one set with data
      const validSets = workoutData[exercise].filter(set => 
        (set.reps !== '' && set.reps !== null) || 
        (set.weight !== '' && set.weight !== null)
      );
      
      if (validSets.length > 0) {
        const routineInfo = exerciseToRoutineMap[exercise];
        const routineName = routineInfo.routineName;
        const routineId = routineInfo.routineId;
        
        // Initialize routine in results if it doesn't exist
        if (!routinesData[routineName]) {
          routinesData[routineName] = {
            routineId: routineId,
            exercises: {}
          };
        }
        
        // Add exercise data to its routine
        routinesData[routineName].exercises[exercise] = validSets;
      }
    });
    
    // Check if there is any data to save
    if (Object.keys(routinesData).length === 0) {
      alert('No exercise data to save. Please log at least one set.');
      return;
    }
    
    // Create final payload (This payload is what we will be saving to the database)
    const payload = {
      date: new Date().toISOString(),
      routines: routinesData
      //duration : workoutDuration         << to be added still
      //userID?? :                         <<
      //xp gained:                         <<

    };
    
    console.log('Workout complete! Full payload to save:', JSON.stringify(payload, null, 2));
    
    // try {
    //   // This is where we will send the data to the backend
    //   const response = await fetch(`/api/log-workout/<%= routine._id %>`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload)
    //   });
      
    //   if (!response.ok) throw new Error('Failed to save workout data');
      
    //   alert('Workout saved successfully!');
    //   // Redirect to workout history or home page
    //   window.location.href = '/workout-history';
    // } catch (err) {
    //   console.error('Error saving workout:', err);
    //   alert('Failed to save workout. Please try again.');
    // }
  });
