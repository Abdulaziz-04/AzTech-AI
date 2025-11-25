---
source: deepdives/interactive_apps/unity_games/unity_games.html
title: Unity Gameplay Suite - Glitch Garden, FPS Survivor, Space Defender, Block
type: page
category: interactive_apps
slug: unity_games
link: https://abdulaziz-04.github.io/deepdives/interactive_apps/unity_games/unity_games.html
---

https://abdulaziz-04.github.io/deepdives/interactive_apps/unity_games/unity_games.html

# Unity Gameplay Suite - Glitch Garden, FPS Survivor, Space Defender, Block
Breaker Interactive Applications, Prototypes & Games

# Unity Gameplay Suite
A compact suite of four Unity projects that highlight core gameplay programming, game loops, and clean scene management. Focus on readable C#, reusable components, and clear player feedback. Each project ships with a short gameplay demo.

### Tech Stack
Unity, C#, Animator, NavMesh, ScriptableObjects, UI Toolkit

## Quick insights

### Goal
Demonstrate gameplay engineering across tower defense, First Person Shooter and arcade physics.

### What stands out
Clear scene flows, Object-oriented programming, modular scripts, and UI feedback loops.

### What you will see
Short videos, concise architecture notes, and the key systems that drive each game.

## Glitch Garden (Plants vs Zombies style) - Hero
Lane defense with timed waves, resources, and defender placement.

### Core loop
Place defenders on a grid with sun as currency while different attackers come down the lanes.

### Key systems

### LevelController
tracks win/lose conditions and ends the level cleanly.

### GameTimer
stops enemy spawns when the countdown finishes.

### Spawner (lane-based)
emits attackers in the correct row.

### Resource store
manages sun currency and spending.

### DefenderSelector/DefenderSpawner
handles selecting units and placing them on the grid.

### Combat scripts

### Defender detectors
sense attackers in-lane and trigger shots.

### Projectile
moves forward, hits enemies, and applies damage.

### Attacker/Health handlers
move, animate, and take damage until defeated.

### UX polish

### SceneManager
controls splash screen and menu navigation.

### MusicManager (singleton)
keeps background audio playing between scenes.

### GameHealthManager
tracks lives and shows win/lose UI.

### Unity features used
Animator-driven attacks and deaths. Prefab spawners and ScriptableObject data where helpful. Basic audio mixing and lightweight VFX.

## FPS Survivor - three weapons, AI waves
Gameplay with NavMesh AI, weapon switching, hitscan and projectile combat.

### Note
Built by following a FreeCodeCamp tutorial to explore FPS architecture and AI patterns in Unity.

### Player systems

### CharacterController movement
handles walking and physics grounding.

### LookMovement
reads mouse input to rotate camera and gun.

### SprintCrouch
toggles speeds and stamina for sprint and crouch.

### PlayerAttack
fires hitscan rays or projectiles based on the equipped weapon.

### Weapons

### WeaponManager
swaps active WeaponHandler and shared data.

### WeaponHandler (per gun)
controls fire mode, aim state, recoil, and muzzle VFX/SFX.

### Enemies

### FSM (Finite State Machine)
a structured way to swap between Patrol, Chase, and Attack states so enemies react predictably.

### EnemyController
FSM that patrols, chases, and attacks using NavMeshAgent.

### EnemyAnimations
syncs FSM states to animator parameters.

### EnemySounds
plays audio cues for footsteps, attacks, and hits.

### Spawning and lifecycle

### Spawner
keeps enemy counts, spawns waves, and respawns after deaths.

### HealthManager
receives damage, plays hit/death feedback, and cleans up enemy objects.

## Space Defender - wave shooter with pathing
ScriptableObject waves, waypoint paths, score HUD, scrolling backdrop.

### Core loop
Player dodges and fires while enemies spawn in waves along predefined waypoint paths.

### Wave design

### WaveConfig (ScriptableObject)
stores prefab, count, spawn rate, and movement path.

### WaveSpawner
reads configs, instantiates enemies, and marches them along waypoints.

### Combat scripts

### Player laser + Damage
fires projectiles that apply health reduction on hit.

### Enemy shooters
fire on timers and grant score when destroyed.

### LaserShredder
removes off-screen projectiles to keep the scene clean.

### UX and flow

### SceneManager
controls menu flow and end-game transitions.

### MusicManager/GameSession (singletons)
persist music, score, and difficulty across scenes.

### BackGroundScroll
scrolls the starfield to imply motion.

## Block Breaker - classic arcade with scene progression
Ball and paddle with damage states, score, and level flow.

### Core loop
Anchor ball to paddle until first click, then break blocks and advance levels. Missed ball triggers game over scene.

### Key scripts

### Initiate
keeps the ball attached to the paddle, then launches it with slight randomness on click.

### PaddleMovement
reads player input and clamps the paddle within camera bounds.

### BlockManager
tracks block hit points, swaps sprites, spawns sparkles, and updates score and breakable counts.

### Progression

### LevelManager
counts remaining breakables and persists score across scenes.

### SceneLoader
loads the next scene or game-over when conditions are met.

### ScoreDisplay
shows totals when the player loses.

### SpeedSlider
adjusts global time scale for slow or fast play.

### Unity features used
Collision events, AudioSource SFX, scene management, DontDestroyOnLoad for persistent state.

## Why it matters

### Breadth
Shows fluency across multiple gameplay patterns including tower defense, FPS, wave shooter, and arcade physics.

### Engineering habits
Consistent scene flow, state management, and modular components that scale to new mechanics.

### Player experience
Focus on readable feedback through UI, audio cues, animations, and reliable inputs.
