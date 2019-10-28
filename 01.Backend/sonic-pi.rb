live_loop :abc do
  use_real_time
  note, echo = sync "/osc/play/piano"
  play_abc note, echo
end

define :play_abc do |note, echo|
  if echo == 1
    with_fx :echo do
      play note
    end
  else
    play note
  end
end
