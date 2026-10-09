# Termite motion

The page depicts wingless workers at a deliberately slow display speed. It is a
biologically informed animation, not a species-specific measured simulation.
No termite-specific six-leg footfall dataset was found in this research.

## Evidence and interpretation

- [DeAngelis, Zavatone-Veth and Clark, 2019](https://elifesciences.org/articles/46409v1)
  tracked freely walking flies. Slower walking favors longer stances; swings
  propagate from hind to middle to front on each side. Opposing legs are offset.
  Turns change step length and direction asymmetrically. We adapt these broad
  insect mechanics to locally coordinated, variable foot contacts, rather than
  assert an exact termite gait or impose a fixed six-beat sequence.
- [Dallmann et al., 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5740276/)
  measured kinematics, ground forces and muscle activity in walking stick
  insects. A posterior leg's touchdown can unload the next leg and permit its
  swing. The animation inhibits nearby feet during recovery, while unrelated
  feet can move independently.
- [Miramontes et al., 2014](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0111183)
  tracked termite workers exploring an arena: movement includes waiting bouts
  and a forward directional bias. Our random walk uses gently changing turns
  and short feeding stops. Its durations and distribution are artistic choices,
  not a fitted Lévy model.
- [Castillo et al., 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8307099/)
  examined Formosan termite antennae by microscopy. Worker antennae have
  bead-like segments. The drawing uses segmented, independently probing
  antennae, a broad worker waist and three thoracic leg attachments.

## Animation mechanics

Each foot has a world-space contact location. During stance that location is
fixed even as the body turns. Each foot has its own stance position, release
threshold and recovery duration (about 0.26–0.38 seconds). Its swing lifts the
foot, flexes the leg, advances with a smooth recovery path, and returns it to
contact. There is no shared gait clock or repeating leg order.

A foot lifts when its contact trails its preferred position or approaches a
reach limit. Adjacent feet on the same side and the directly opposing foot
inhibit each other's recovery. Other legs may lift independently, with at least
four feet planted and contacts surrounding the projected body center. Each
termite starts with different stance ages; slight variation in recovery duration
avoids a metronomic cadence. These are animation approximations of local
coordination and support, not a measured termite controller.

Coxa, femur, tibia and tarsus are drawn separately. A three-dimensional two-link
solver maintains constant femur and tibia lengths and a consistent knee bend
direction. Foot height changes the solution during recovery. Stride timing
depends on body translation and rotation; target placements account for each
foot's local velocity, so outside feet cover more distance during turns. Body
movement is limited before a support foot becomes unreachable. Feeding stops
finish an existing swing, then hold the feet while antennae and mandibles move.

All dimensions, timings and joint bend targets are tuned in display pixels.
This is a kinematic approximation without joint torque, force balance or a
termite-specific musculoskeletal model. Thirty-frame-per-second painting makes
the short recovery visible; the existing population, canvas memory, idle delay,
activity reset and reduced-motion limits remain in place.

Tests check contact pinning, staggered starts, variable independent footfalls,
local inhibition, four-foot support, three-dimensional segment lengths, turning
asymmetry, feeding stops, edge recovery and irregular frame intervals. Browser
review checks the rendered motion in both themes.
