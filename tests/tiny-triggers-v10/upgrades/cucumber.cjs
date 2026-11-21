module.exports=async(page,io,a)=>{
 // A thick first cut is still wrong; a stationary click cannot cut anything.
 await io.drag([191,82],[191,170]);a.equal((await io.state()).phase,0);
 await io.click(162,120);a.equal((await io.state()).phase,0);
 // Natural route: pick up the visible knife, bring it left onto the skin,
 // then cut diagonally down. Original code rejected the whole tool drag.
 await io.down(393,50);await io.move(169,109);await io.move(180,178);await io.up();
 a.equal((await io.state()).phase,1);a.equal((await io.state()).widths.length,1);
 let edge=(await io.state()).edge;
 // Finger-sized tolerance: start slightly inside the skin, slant the stroke.
 await io.drag([edge+53,116],[edge+71,181]);a.equal((await io.state()).phase,2);
 await io.wait(180);await io.shot('during');
 edge=(await io.state()).edge;
 await io.drag([edge+5,95],[edge-5,171]);a.equal((await io.state()).phase,3);
 edge=(await io.state()).edge;
 await io.down(393,50);await io.move(edge+46,98);await io.move(edge+34,174);await io.up();
 await io.until(s=>s.done);const w=(await io.state()).widths;
 a.ok(w[0]<=14&&w[1]>=36&&w[2]<=14&&w[3]>=36);
};
