live_loop :midi_piano do
  use_real_time
  note, velocity = sync "/osc/play/piano"
  synth :piano, note: note
end