# --- Live Loops ---
live_loop :abc do
  use_real_time
  note, echo = sync "/osc/play/piano"
  play_note note, echo
end

live_loop :ch do
  use_real_time
  note, mode, echo = sync "/osc/play/chord"
  play_the_chord note, mode, echo
end

# --- Methods ---
define :play_note do |note, echo|
  if echo == 1
    with_fx :echo do
      play note
    end
  else
    play note
  end
end

define :play_the_chord do |root, quality, echo|
  if quality == ""
    m = :major
  else
    if quality == "m"
      m = :minor
    else
      m = :diminished
    end
  end
  puts m
  
  if echo == 1
    with_fx :echo do
      play chord(root, m)
    end
  else
    play chord(root, m)
  end
end
