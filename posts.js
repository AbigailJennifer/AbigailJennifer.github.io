/* Add new posts at the TOP of this list. Dates are YYYY-MM-DD (shown as 18 November 2026).
   img: banner image path. toc:false hides the Contents tab. Tags must match research.html slugs. */
window.POSTS=[
{id:"welcome",img:"images/blog/welcome.png",date:"2026-11-04",
 title:"Welcome to my Open Notebook: Why this Blog Exists",
 sub:"A home for my inputs, outputs, their interpretations and general discussions",
 tags:[],toc:false,
 body:'<p>Welcome. This page keeps my work in one place: the calculations I run, the inputs I write, the outputs and spectra that come out of them, and the notes I make along the way.</p>'+
 '<h2>Why I made it</h2><p>Research on heavy elements involves many small decisions that rarely reach a paper: which active space I tried, why a calculation did not converge, how a spectrum was broadened. Writing these down helps me repeat my own work and, I hope, helps students who are starting on similar problems.</p>'+
 '<h2>What you will find here</h2><ul><li><b>Inputs:</b> annotated examples of how a calculation is set up.</li><li><b>Outputs:</b> results, spectra and the plots made from them.</li><li><b>Notes:</b> what worked, what failed and what I would do differently.</li></ul><p>Every post carries tags that match the topics on my research page, so a tag there leads you to the related posts here.</p>'+
'<h2>A note on images</h2><p>Most of the images on this blog and on my research page are AI-generated. They are there to illustrate, not to present data. The graphical abstracts that accompany my publications are the exception: I created those from scratch myself.</p>'+
'<h2>A last word</h2><p>I will add posts as my work moves along, so the blog will grow unevenly, in step with the research. These are my own working notes, so if something is unclear, I would be glad to hear about it.</p>'},
{id:"core-hole-to-spectrum",img:"images/blog/xray.svg",date:"2026-11-04",
 title:"From core hole to spectrum",
 sub:"Why X-ray spectra of small heavy-element complexes need more than one configuration",
 tags:["xas","xes","multireference","l-edge","spectroscopy"],toc:true,
 body:'<p class="ph">Placeholder text. Replace it with your own writing when you are ready.</p>'+
 '<h2>Absorption</h2><p>In X-ray absorption, a photon lifts a core electron into an empty orbital and leaves a core hole behind. The energy of the absorbed photon tells us how far that electron moved and what the empty orbitals around the metal look like.</p>'+
 '<h2>Emission</h2><p>In X-ray emission, an electron from a higher occupied level falls into the core hole and a photon leaves. For valence-to-core emission, the electrons that fall are those involved in bonding to the donor atoms of the ligands.</p>'+
 '<h3>Small complexes as test cases</h3><p>Tetrahalide and hexaaqua complexes keep the focus on the metal and its bonded donor atoms, which makes the link between spectrum and bonding easier to read.</p>'+
 '<h2>Why several configurations</h2><p>Near a heavy metal, spin-orbit coupling is large and core-excited states mix several electron configurations. A single-determinant picture misses this, so a multiconfigurational wavefunction is used and the spectrum is built from the computed states and their intensities.</p>'+
 '<p class="ph">Add figures, references and a closing thought here.</p>'},
{id:"actinide-spectroscopy",img:"images/blog/placeholder.svg",date:"",
 title:"Understanding actinide spectroscopy simulations",
 sub:"Electronic structure methods, L-edge spectroscopy and multireference calculations",
 tags:["actinides","xas","l-edge","multireference","spectroscopy"],toc:true,
 body:'<p class="ph">Draft in progress. Full text coming soon.</p><h2>Overview</h2><p class="ph">To be written.</p>'},
{id:"cas-future-leaders",img:"images/blog/placeholder.svg",date:"",
 title:"My experience at the CAS Future Leaders Program",
 sub:"Networking, leadership training and interdisciplinary collaboration",
 tags:["outreach","student-voice"],toc:true,
 body:'<p class="ph">Draft in progress. Full text coming soon.</p><h2>Reflections</h2><p class="ph">To be written.</p>'}
];
