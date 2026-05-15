import { useState, useEffect, useRef, useCallback } from 'react';

const SECTIONS = [
  { id: 'section-1', numeral: 'I',   title: 'The Incantation',                 dates: '1969–1971' },
  { id: 'section-2', numeral: 'II',  title: 'The Architecture of Abdication',  dates: '1969 to the late 1970s' },
  { id: 'section-3', numeral: 'III', title: 'The Inheritors',                  dates: 'Late 1970s to 1980' },
  { id: 'section-4', numeral: 'IV',  title: 'The Diagnostic',                  dates: '1980–1999' },
  { id: 'section-5', numeral: 'V',   title: 'The Bifurcation',                 dates: '2000–2019' },
  { id: 'section-6', numeral: 'VI',  title: 'The Revolution as Lifestyle Brand', dates: '2020–present' },
  { id: 'section-7', numeral: 'VII', title: 'The Persistence of the Spell',    dates: '1969–2025' },
];

const H2 = ({ children }) => (
  <h2 style={{
    fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 500,
    color: '#d4822a', margin: '40px 0 16px', lineHeight: 1.3,
  }}>{children}</h2>
);

const P = ({ children }) => (
  <p style={{ margin: '0 0 20px' }}>{children}</p>
);

export default function SacrificeSacrificeSacrifice() {
  const [active, setActive] = useState('section-1');
  const refs = useRef({});

  const handleJump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.target.offsetTop - b.target.offsetTop);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-140px 0px -55% 0px', threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (SECTIONS.some((s) => s.id === id)) {
        setTimeout(() => handleJump(id), 80);
      }
    }
  }, [handleJump]);

  const onAnchorClick = (e) => {
    const target = e.target.closest && e.target.closest('a[data-jump]');
    if (target) {
      e.preventDefault();
      handleJump(target.getAttribute('data-jump'));
    }
  };

  const activeSection = SECTIONS.find((s) => s.id === active) || SECTIONS[0];

  return (
    <div onClick={onAnchorClick} style={{
      fontFamily: "var(--body)",
      fontSize: "18px",
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.85)",
    }}>
      <div style={{
        position: 'sticky',
        top: '64px',
        background: 'rgba(10,10,10,0.94)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        margin: '0 calc(-1 * var(--page-pad)) 32px',
        padding: '14px var(--page-pad) 12px',
        zIndex: 5,
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
          gap: 'clamp(14px, 2.4vw, 26px)',
        }}>
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-jump={s.id}
                aria-label={`${s.numeral}. ${s.title}`}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  padding: '4px 0',
                  borderBottom: isActive ? '2px solid #d4822a' : '2px solid transparent',
                  color: isActive ? '#d4822a' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                {s.numeral}
              </a>
            );
          })}
        </div>
        <div style={{
          maxWidth: 900, margin: '6px auto 0',
          fontFamily: 'var(--mono)', fontSize: '11px',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.5)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.85)' }}>{activeSection.title}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>{'  ·  '}</span>
          <span>{activeSection.dates}</span>
        </div>
      </div>

      <section id="section-1" ref={(el) => { refs.current['section-1'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>1. The Incantation</H2>

        <P>1969&ndash;1971</P>

        <P>There is a moment halfway through the film adaptation of Fear and Loathing in Las Vegas that I keep replaying in my mind. Raoul Duke is crawling on his back like a Kafkaesque insect on the coarse hotel carpet of the trashed suite at the Mint Hotel, while Nixon&rsquo;s face blooms across the television screen. The President&rsquo;s lips move through the ritual of address, but as countless chemicals muddle Duke&rsquo;s perception, the boundaries of the broadcast begin to ripple. The word &ldquo;sacrifice&rdquo; floats free from its syntax and starts to loop, filling the room with its resounding echo. Nixon&rsquo;s face emerges from the glass and haunts the air above Duke, the word vibrating between incantation and accusation, a prescription recited until it overwrites thought.</P>

        <P>Thompson&rsquo;s genius in this scene was not the clich&eacute; of the drug-addled vision but the capacity to recognize, in distortion, the truth of the apparatus itself. This is 1971, but he&rsquo;s showing us what began November 3, 1969, when Nixon addressed the nation about Vietnam: &ldquo;And so tonight, to you, the great silent majority of my fellow Americans, I ask for your support.&rdquo; The line would rewire the nation&rsquo;s political consciousness, transforming the weariness of the white middle class into a sanctified form of refusal. Nixon&rsquo;s speech was not for those in the streets, but for Americans exhausted by protest, hungry for official permission to disengage. He didn&rsquo;t invoke sacrifice as a call for collective action, but as evidence that legitimacy had already been earned: &ldquo;No one can say that we are not making a sacrifice for peace.&rdquo; Throughout the speech, sacrifice is the refrain: a bridge between private suffering and public power. In this reframing, disengagement is no longer cowardice or apathy; it is transformed into a national service, a moral accomplishment.</P>

        <P>Nixon&rsquo;s rhetorical machinery operated in a closed circuit, each line crafted to reinforce the others, every appeal designed to dissolve the boundaries between passivity and virtue. &ldquo;Let us understand: North Vietnam cannot defeat or humiliate the United States. Only Americans can do that.&rdquo; The adversary is no longer external, but internal; dissent becomes self-destruction, protest a form of sabotage. The act of opposition is recast as a kind of treason, the silent audience as guardians against collapse.</P>

        <P>Sacrifice, in Nixon&rsquo;s lexicon, was always a demand made of someone else. The phrase appeared repeatedly in his speeches, but always attached to invisible exemptions. The President called for unity in the name of peace, which was made to mean the continued prosecution of war. Unity, as he defined it, consisted in the refusal to protest, the agreement to leave hard choices unspoken and unchallenged. The silent majority learned that the highest form of support was to oppose the protestors, to enact citizenship by staying home and letting the machinery run without interference. The spell was efficient because it promised that true sacrifice could be accomplished by insisting that others do the sacrificing. Inaction became a kind of public virtue, a transformation so total that the ordinary rhythms of suburban life were suddenly recast as patriotic rites.</P>

        <P>Thompson&rsquo;s vision, rendered in the hallucinatory grammar of the film, lays bare a pathology that metastasized across five decades. What he saw was not the mere manipulation of language, but the installation of a ritual that would shape every future invocation of sacrifice in American public life. The word would continue to circulate through speeches, op-eds, campaign ads, and newscasts, always carrying the residue of that first spell. It became the engine of selective burden, the instrument by which exemption could be recoded as a moral accomplishment.</P>

        <P>The spell demands renewal. Every subsequent administration will find its own version of the ritual, its own way of redeploying the incantation in the service of selective burden and cyclical relief. The logic will persist: exemption becomes virtue, virtue becomes the currency of power, sacrifice is redefined as the obligation of someone else. What Thompson saw through the haze of chemicals was not simply a hallucination, but a diagnosis. The incantation he witnessed in 1971 is still the organizing principle of American public life, repeated endlessly, always promising that the highest form of participation is the power to insist that someone else take your place at the altar.</P>
      </section>

      <section id="section-2" ref={(el) => { refs.current['section-2'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>2. The Architecture of Abdication</H2>

        <P>1969 to the late 1970s</P>

        <P>Nixon&rsquo;s 1969 address functioned not only as a speech, but as an intricate choreography of permission and withdrawal. He did not ask the American public to act or even to approve, but rather invited them to retreat into the sanctity of their living rooms and to discover within this retreat a new moral order. The ritual was never named directly, yet its mechanics were unmistakable. Ordinary life, undisturbed by conflict or protest, became a badge of virtue. The broadcast delivered not a call to sacrifice, but a benediction for those who longed to be untroubled by consequence. One could claim innocence and even righteousness by declining to engage, by sustaining the rituals of family and suburb, by maintaining the surface of continuity as history worked itself out elsewhere.</P>

        <P>Children, watching this spectacle from the edges of the room, became experts in emotional translation long before they understood the content of politics. They absorbed not only the words, but the way their parents&rsquo; bodies relaxed at certain phrases, the way anxiety dissipated when the President spoke of the silent majority and the righteousness of patience. The lesson was not delivered in argument, but in the gentle discipline of the everyday. Safety was achieved not through struggle or negotiation, but by harmonizing with the emotional atmosphere established by adults who had themselves endured wars and depressions and now wished for quiet. These children learned to read the climate of a household, to align themselves with the prevailing mood, to avoid disrupting the equilibrium that promised them a share in the blessings of distance.</P>

        <P>The suburbs themselves became a curriculum, teaching the art of exclusion through infrastructure and routine. Streets and schools were planned with deliberation, and their boundaries were justified by a language that was both familiar and elusive. Phrases like &ldquo;the schools are getting rough&rdquo; or &ldquo;the neighborhood is changing&rdquo; recurred as if they were neutral observations, when in truth they named and defended the new distribution of risk. To say &ldquo;we&rsquo;re thinking of the children&rdquo; was to invoke a moral imperative that required no specifics, only a shared sense that some forms of contact were best avoided. This grammar of abdication, composed of euphemism and code, taught children that virtue could be performed by not naming what everyone already knew. It was possible to master the rules of belonging without ever hearing them spoken aloud.</P>

        <P>Throughout the 1970s, these private rituals accumulated into public facts. The great migrations from cities like Detroit, Newark, and St. Louis to their surrounding suburbs were explained in the language of opportunity and prudence, never as an admission of flight or exclusion. The loss of population and shifting tax bases were made invisible by the appearance of new schools and thriving subdivisions. The surface of American life was remade by individual choices that each appeared reasonable, but that together reorganized access, security, and expectation along lines drawn by unspoken agreement.</P>

        <P>Children lived inside these changes as if they were natural phenomena. They heard their parents offer reasons for moving or for choosing a different school, reasons always left vague enough to avoid discomfort, but clear enough to signal what could not be admitted. Better meant whiter. Safer meant separated. Opportunity for one group meant the slow, silent erosion of another&rsquo;s prospects. The arithmetic of scarcity was hidden behind a rhetoric of striving, and the discipline of not noticing became a central part of growing up. Abdication was taught not as an argument, but as a way of managing discomfort, a technique for sustaining the sense of innocence and the illusion of inevitability.</P>

        <P>This was not a matter of conspiracy, nor was it achieved through explicit collusion. The real power of abdication was its capacity to present itself as simple consensus, the result of countless decisions made by people who believed themselves moderate, practical, and fair. The public invocation of community values and shared purpose stood in stark contrast to the precision with which boundaries were drawn and maintained. For children who learned to watch and listen, the gap between public language and private certainty became the defining structure of their world.</P>

        <P>Cynicism took hold not as a fashionable pose, but as a logical adaptation to a world where the highest adult virtue was practiced indifference. Commitment came to seem naive. Irony and detachment became forms of armor. The system taught that to care too much was dangerous and that presence was costly. The performance of agreement and the avoidance of conflict became prerequisites for belonging, and authenticity became a liability rather than a mark of character.</P>

        <P>When these patterns became the inheritance of a new generation, the process adapted to changing circumstances but never lost its essential logic. The language shifted to fit the times. School choice replaced neighborhood schools, merit replaced local control, but the underlying machinery remained. Institutions learned to celebrate inclusion in principle while continuing to protect the status quo in practice. The skill of honoring difference without disturbing the allocation of power or resources became a mark of sophistication. Children who had learned to read the room became adults who learned to read institutions, refining their understanding of what could be altered and what must remain unquestioned.</P>

        <P>The architecture of abdication is more than a collection of policies or a map of demographic changes. It is an education in selective attention and an ongoing pedagogy of silence. What is truly handed down from one generation to the next is not a set of opinions or positions, but a disciplined sense of what cannot be seen, what must not be asked, and what will never be said. The work of sustaining comfort by avoiding responsibility continues not through grand declarations, but through the small, daily negotiations of attention and memory. This is not simply unfinished business, but the persistent mechanism by which innocence is inherited and the difficult work of reckoning is indefinitely deferred.</P>
      </section>

      <section id="section-3" ref={(el) => { refs.current['section-3'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>3. The Inheritors</H2>

        <P>Late 1970s to 1980</P>

        <P>California, 1978. Howard Jarvis barnstorms the state with a gospel beguilingly simple: property taxes are suffocating families, uprooting elders, extracting unearned tribute from households who only want continuity. The message lands with surgical precision. Who would dare to defend a government assessor against a grandmother whose house is slipping from her grasp?</P>

        <P>This is the public theater. Beneath it, the machinery of advantage is recalibrating itself for a new era. Proposition 13 will freeze property tax increases at two percent annually, fixed to the date of purchase. Two homes on a single block, identical except for timing of sale, will now exist in parallel universes of obligation. The law applies, in principle, to everyone. In practice, it is an engine of compound inequality. Corporate properties gain the same privilege, but with careful legal maneuvering, corporations can evade reassessment for generations. Chevron and a local grandmother now inhabit the same protected class, though only one employs an army of tax attorneys.</P>

        <P>For the generation arriving into their prime years of household formation, the lesson is immediately legible. The Boomers recognize in Prop 13 not just relief from taxes, but an invitation to write the terms of inheritance. Timing supplants effort. The crucial act is not building, but arriving first. They understand that advantage can be crystallized and preserved in the architecture of law. This is not tax reform; it is the creation of a new American aristocracy, one grounded not in lineage but in the date stamped on a closing contract.</P>

        <P>The brilliance of the arrangement lies in how quickly its origins are effaced. What begins as populist outcry hardens, almost overnight, into orthodoxy. Proposition 13 becomes constitutional relic, beyond the reach of ordinary politics. The generation that once took to the streets against authority now finds securing privilege far more durable than momentary revolt. Their motives are reframed as civic duty. They are not hoarding, but &ldquo;protecting property values.&rdquo; They are not closing doors, but &ldquo;maintaining neighborhood character.&rdquo; Every act of self-interest is washed in the language of virtue.</P>

        <P>By 1990, the system&rsquo;s distortions are undeniable. Commercial properties unsold since 1978 are assessed as if explosive appreciation never occurred. The burden shifts toward those least equipped: new buyers, renters, anyone whose stake arrives too late. School districts dependent on property taxes experience hollowing. The once world-class public education system enters slow descent, dragging libraries, parks, and municipal services with it.</P>

        <P>Inside the houses secured by constitutional amendment, the world appears stable, even improved. Boomers settle into their roles as stewards of private comfort, increasingly detached from the slow death of public goods. The rhetoric of reform fades, replaced by stories of hard work and prudence. For children growing up in these neighborhoods, the education is visceral. They see it in gradual decay of school buildings, in shuttered library hours, in the broken promise of the swimming pool that no longer opens. These children learn that the world divides between insiders and those who came too late. The public is disappointment. The private is the only security.</P>

        <P>This model propagates across the country, acquiring new names but repeating the essential script. Massachusetts enacts Proposition 2&frac12;. Michigan installs the Headlee Amendment. Each preserves the logic of temporal entitlement, each sells intergenerational exclusion as defense of ordinary people. By the Reagan era, this architecture is national, woven into what is now called fiscal responsibility.</P>

        <P>Yet what emerges is not only an economic order, but an order of memory. The moment of taking, once justified by crisis, becomes cloaked in forgetfulness. The mechanisms of capture recede from view, replaced by narratives of deservingness and discipline. The Boomer generation tells its story as survival and prudence, not exclusion or luck. This is generational amnesia perfected, ensuring that the costs of comfort can be exported without guilt, that the story of sacrifice always stars someone else.</P>

        <P>This is the final genius of Proposition 13. It transforms theft into tradition, exclusion into common sense, and memory into a private archive accessible only to those who wrote themselves in while the doors were still open.</P>
      </section>

      <section id="section-4" ref={(el) => { refs.current['section-4'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>4. The Diagnostic</H2>

        <P>1980&ndash;1999</P>

        <P>Bruce Cannon Gibney&rsquo;s A Generation of Sociopaths reads less like cultural criticism than clinical observation, a systematic cataloging of behaviors so consistent they transcend individual variation and reveal collective pathology. The book&rsquo;s genius lies not in its provocative title but in its methodical documentation of how a generation that inherited unprecedented prosperity managed to dismantle the very systems that created it, all while maintaining perfect conviction in their own virtue. Gibney, himself a venture capitalist who watched this generation operate from inside their boardrooms and investment committees, brings the diagnostic precision of someone who&rsquo;s seen the patient up close, who understands that what looks like greed or shortsightedness from the outside reveals itself as something more troubling from within: a fundamental inability to conceive of obligations that extend beyond the self.</P>

        <P>But the pathology Gibney describes had been building since Nixon&rsquo;s spell first took hold. Reagan didn&rsquo;t create Boomer sociopathy; he gave it presidential permission, transforming what had been individual impulses into national policy. &ldquo;Government is not the solution to our problem; government is the problem.&rdquo; The line works as political rhetoric, but decode what it actually meant to the generation hearing it: the systems that built middle-class prosperity, that created the suburban paradise they inherited, that funded the universities where they discovered themselves, these systems were now impediments to further accumulation. Time to dismantle them. But carefully, quietly, with a movie star&rsquo;s smile that made destruction feel like morning in America.</P>

        <P>The extraction begins in earnest. Unions are gutted while speaking of &ldquo;right to work.&rdquo; Safety nets are shredded while invoking &ldquo;welfare queens,&rdquo; a racist phantom conjured to justify cruelty as fiscal responsibility. Infrastructure rots while cutting taxes for &ldquo;job creators,&rdquo; though the jobs created seem always to be elsewhere, for someone else, at wages that would have embarrassed their parents&rsquo; generation. Every policy becomes a mechanism for upward wealth transfer, always sold as common-sense reform, as getting government off the backs of ordinary Americans, though the Americans getting relief all seem to live in the same zip codes.</P>

        <P>Gibney documents this with actuarial precision: the defunding of public universities precisely as Boomers aged out of them, the cutting of mental health services once their experimental drug phase ended, the dismantling of job training programs once their careers were established. Each cut timed with remarkable accuracy to when that generation no longer needed the service in question. It&rsquo;s not mere correlation; it&rsquo;s a pattern so consistent it suggests an instinctive understanding of collective self-interest so refined it needs no explicit communication.</P>

        <P>Then comes Clinton, the first Boomer president, born 1946, the literal first year of the boom, as if history itself wanted to mark the transition with clarity. Here&rsquo;s where liberals comfort themselves with false distinction, imagining that surely their Boomer was different, that the saxophone and the Oxford education and the &ldquo;I feel your pain&rdquo; empathy meant something had changed. But Clinton completes what Reagan started, and he does it with brutal efficiency. He declares &ldquo;the era of big government is over,&rdquo; as if government had been some occupying force rather than the mechanism that built the middle class his generation inherited.</P>

        <P>Watch him work. Welfare &ldquo;reform&rdquo; throws millions into poverty while being sold as &ldquo;empowerment.&rdquo; NAFTA ships jobs overseas while promising prosperity for all. Glass-Steagall dies with bipartisan approval, Democrats and Republicans joining hands to unleash the financial sector just in time for Boomers to start gambling with their accumulated housing wealth. The crime bill creates the world&rsquo;s largest prison system while Clinton plays jazz on Arsenio, the incarceration of millions providing the perfect backdrop for suburban comfort.</P>

        <P>This is what Gibney&rsquo;s thesis illuminates: the sociopathy isn&rsquo;t partisan. It&rsquo;s generational. Clinton and Gingrich may have feuded over personal scandals, but they agreed on the fundamentals. Dismantle the regulations. Financialize everything. Let the market sort out who deserves to survive. The Boomers had captured both parties, ensuring that regardless of who won elections, their interests would prevail.</P>

        <P>By 1999, the machine runs so smoothly you could forget it runs on extraction. The stock market soars to absurd heights, every 401k a lottery ticket. McMansions sprawl across former farmland like metastatic cells, each one identical in its studied uniqueness. Everyone&rsquo;s house becomes an ATM, home equity lines of credit funding consumption that would have horrified their Depression-era parents. The future has been successfully mortgaged, but the bills haven&rsquo;t come due yet.</P>

        <P>The Millennials were in elementary school when Clinton declared the era of big government over, too young to understand policy but old enough to feel the texture of abandonment. Born into the full flower of Reagan&rsquo;s America, they experienced the dismantling as natural state; not decay but simply the way things were. Their parents, those forgotten Gen Xers and late Boomers, had already internalized the impossibility of collective solutions. So they invested everything in their children as individual projects, as private solutions to public failures.</P>

        <P>This was the participation trophy generation not because they were soft but because their parents understood that actual competition was rigged. Every soccer game where everyone got a medal was a rehearsal for a world where symbolic victories would substitute for material ones. The trophies taught them to perform achievement rather than achieve, to perfect the metrics rather than the substance. They learned to optimize themselves like products because that&rsquo;s what their parents knew they&rsquo;d need to become.</P>

        <P>By 1999, the oldest Millennials were graduating high school into a world that looked like prosperity but felt like quicksand. The NASDAQ hit 5,000 while college costs had tripled since their parents&rsquo; time, but everyone insisted this was the path. They signed the loan papers at eighteen, too young to understand they were volunteering for a new form of sacrifice: mortgaging their futures for the chance to compete in a game already rigged against them. The spell had evolved again. Not &ldquo;someone else should sacrifice&rdquo; but &ldquo;sacrifice your future for entry into a game already rigged against you.&rdquo;</P>
      </section>

      <section id="section-5" ref={(el) => { refs.current['section-5'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>5. The Bifurcation</H2>

        <P>2000&ndash;2019</P>

        <P>The new millennium brings clarity with the force of revelation: there are now two ways to perform the American spell, and both lead to the same place.</P>

        <P>The first erupts after 9/11 like something volcanic and ancient, draped in flags and fury. Bush, born 1946, another first-year Boomer, channels the fear into endless war with the precision of someone who&rsquo;s been waiting for exactly this opportunity. &ldquo;You&rsquo;re either with us or against us.&rdquo; The silent majority discovers it actually loves being loud, as long as someone else bleeds for the volume. The PATRIOT Act passes with bipartisan enthusiasm, Democrats and Republicans united in their conviction that freedom means letting the government read your email. The wars make brutal sense until they don&rsquo;t, until it becomes clear that the point isn&rsquo;t winning but continuing, that the sacrifice of American soldiers and Afghan civilians serves primarily to justify more sacrifice, more contracts, more extraction dressed as liberation.</P>

        <P>But here&rsquo;s where it gets interesting, where the second strain develops in parallel. The professional class, educated and comfortable, develops its own method for maintaining supremacy while feeling good about it. They want their empire with better manners, their wars with exit strategies, their extraction with emotional intelligence. Obama&rsquo;s election seems like generational change, though barely. The wars continue with drone strikes instead of ground troops, the kill list modernized for the digital age. The surveillance state expands with the kind of efficiency that would have made Hoover weep with envy.</P>

        <P>Then comes the financial crisis, and the bailouts reveal everything. Here&rsquo;s a generation that spent thirty years preaching about moral hazard and personal responsibility, about how welfare creates dependency and how the market must be allowed to work its brutal magic. The same people who cheered when Clinton gutted welfare because single mothers were &ldquo;gaming the system&rdquo; for $300 a month suddenly discovered the virtues of government intervention when their portfolios started hemorrhaging. Wells Fargo got $25 billion while foreclosing on families who missed payments by a week. Bank of America swallowed $45 billion in taxpayer money while kicking people out of homes the bank fraudulently claimed to own. The same generation that killed free school lunch programs because &ldquo;there&rsquo;s no free lunch&rdquo; demanded and received the largest free lunch in human history, all to ensure that the generation that gambled the economy into collapse doesn&rsquo;t have to experience any actual consequences.</P>

        <P>Meanwhile, the professional-class Boomers perfect their own version of the con. They speak in the language of progress while defending every structure that maintains their advantage. They live in neighborhoods zoned to exclude anything affordable, send their children to schools funded by property taxes that price out anyone who didn&rsquo;t buy in 1978, all while maintaining perfect progressive credentials. They post &ldquo;In This House We Believe&rdquo; signs on lawns that might as well be moated, vote for Democrats who promise change while ensuring nothing fundamental changes, especially not their property values or their tax advantages or their ability to extract rent from everyone younger and poorer than themselves.</P>

        <P>The hypocrisy achieves near-perfect form in places like San Francisco or Brooklyn, where liberal Boomers have created entire economies based on pricing out the very people who make cities function. They&rsquo;ll march for immigrant rights but vote against the apartment building that might house those immigrants. They&rsquo;ll post about income inequality from houses that have appreciated 2000% while ensuring through zoning and regulation that no one can build anything that might dilute their investment. They want justice, sure, but not if it affects the neighborhood&rsquo;s character.</P>

        <P>Then comes Trump, born 1946, because of course he fucking was. He doesn&rsquo;t represent a break from Boomer power but its apotheosis, its final form freed from even the pretense of shame. He makes the con the pitch, says the quiet parts through a megaphone, turns the subtext into text in 280-character bursts. The polite Boomers are horrified, not by the policies but by the presentation. He&rsquo;s revealing the mechanics of their comfortable compromise, making visible what they&rsquo;ve spent decades obscuring with bureaucratic language and procedural norms.</P>

        <P>But watch closely: both sides run on the same fuel. Whether they&rsquo;re screaming at rallies or shaking their heads at wine bars, they agree on the fundamental premise that sacrifice is what other people do. The red hats want brown people to pay. The pink hats want someone else to pay, they&rsquo;re just nicer about it. Both sides will fight to the death to protect their accumulated advantages, their temporal feudalism, their right to extract value from anyone who didn&rsquo;t get there first.</P>

        <P>By 2019, the split is complete but meaningless. Two wings of the same generational project, arguing about tone while agreeing on substance. The loud ones demand sacrifice through cruelty. The quiet ones demand it through systems. Both ensure that someone else always pays the bill, that the generation that inherited the greatest shared prosperity in human history will pass on nothing but debt and degraded systems and a burning planet they&rsquo;ll be dead before it fully ignites.</P>
      </section>

      <section id="section-6" ref={(el) => { refs.current['section-6'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>6. The Revolution as Lifestyle Brand</H2>

        <P>2020&ndash;present</P>

        <P>The pandemic arrives as a kind of moral stress test for a society long practiced in ritual avoidance. The slogan &ldquo;We&rsquo;re all in this together&rdquo; travels through screens and speakers, spoken by those insulated from danger, to those who confront it daily and without protection. The phrase is emptied of substance with every repetition. Sacrifice is distributed, but only in one direction. Grocery clerks, nurses, drivers, and teachers inherit the risks. The rest inherit the comfort of symbolic solidarity.</P>

        <P>Night after night, New Yorkers lean out of windows and clap, striking pans to thank the nurses laboring below. The ritual is public, loud, and costs nothing. Inside the hospitals, protective equipment is rationed. Nurses store single-use masks in paper bags and wear garbage bags for gowns. The applause is not an intervention. It is an anesthetic, transforming real guilt into spectacle and allowing the machinery of abandonment to continue. Later, these same audiences will reject ballot measures for safe staffing or healthcare funding, ensuring that &ldquo;essential&rdquo; workers remain essential only as long as they remain replaceable.</P>

        <P>The murder of George Floyd creates a rupture, a momentary breach in the containment field. Protests fill the streets, and the urgency is undeniable. Yet almost immediately, the apparatus of performance begins its work. Black Lives Matter becomes a signpost on manicured lawns, a slogan inscribed on windows in neighborhoods where affordable housing is defeated at every vote. Book clubs devour antiracism texts and social media is overtaken by black squares, but municipal budgets remain unchanged and property lines unchallenged. Corporations hire consultants and publish statements, but diversity remains cosmetic. Every act of self-examination is converted into curriculum, reading list, or keynote. Justice becomes the work of self-understanding, while structures remain intact.</P>

        <P>When the language of &ldquo;Defund the Police&rdquo; explodes into public discourse, it is rapidly metabolized by the logic of administration. Cities hold hearings, launch commissions, and promise oversight, but policing budgets quietly increase and new forms of bureaucratic management absorb the shock. Minneapolis debates abolition, then votes to preserve its department. New York schedules more training. The revolution becomes a calendar of listening sessions and strategic plans. Nothing fundamental moves.</P>

        <P>The professionalization of resistance becomes a closed loop. Consultants monetize virtue, delivering workshops to companies that preserve old hierarchies. Universities begin each event with land acknowledgments, admitting to theft while retaining the land and its wealth. Suburbs circulate antiracist bestsellers while maintaining exclusion through price and policy. Performative self-awareness replaces material change. Even critique of the performance is folded back into the cycle, an additional layer of display and reassurance.</P>

        <P>Every generation finds its own way to participate. Boomers convert the language of the sixties into new rationalizations for comfort, adopting the vocabulary of inclusion without ceding any advantages secured in earlier decades. Gen X navigates the machinery of compliance with weary intelligence, managing the same institutions they once distrusted, implementing policies they know are insufficient. Millennials inherit the script as therapeutic mandate, learning that progress can be measured by the complexity of their statements and the sincerity of their acknowledgment. Gen Z arrives into a landscape saturated with performance, switching effortlessly from outrage to irony to resignation, understanding that action is always potentially content, always subject to being monetized or surveilled.</P>

        <P>The architecture of performance is now total. Every form of engagement risks being metabolized by the machine it claims to oppose. Every call for sacrifice is translated into ritual, every ritual rendered safe by the absence of actual cost. The word &ldquo;sacrifice&rdquo; still echoes through public life, demanded constantly, always extracted from those with the least margin, always justified by those whose comfort is secured in advance. The promise of transformation becomes indistinguishable from its simulation. The performance endures, feeding on its own exposure, exhausting the energies that once might have produced change. The revolution has become a mirror, and the image reflected is always someone else&rsquo;s problem, someone else&rsquo;s loss, someone else&rsquo;s duty to endure.</P>
      </section>

      <section id="section-7" ref={(el) => { refs.current['section-7'] = el; }} style={{ scrollMarginTop: '140px' }}>
        <H2>7. The Persistence of the Spell</H2>

        <P>1969&ndash;2025</P>

        <P>Thompson catches something in that hotel room that transcends the particular nightmare of his moment. Nixon&rsquo;s face pushing through the television screen, the word &ldquo;sacrifice&rdquo; detaching from syntax and becoming pure incantation, Duke crawling through the wreckage while the broadcast pursues him through dimensions that shouldn&rsquo;t exist. This isn&rsquo;t just about 1971 or Watergate or Vietnam. It&rsquo;s about what happens when a word gets repeated so long it restructures reality around its repetition, when the broadcast becomes indistinguishable from the air itself.</P>

        <P>Fifty-six years later and we&rsquo;re all breathing it. The word has eaten through everything: through language until it only points outward, through policy until extraction feels inevitable, through possibility until we can&rsquo;t imagine otherwise. &ldquo;Sacrifice&rdquo; doesn&rsquo;t mean what the dictionary says anymore. It means a kind of mathematical certainty that someone else will pay whatever price needs paying while we perform elaborate rituals to justify our exemption.</P>

        <P>Every crisis follows the same pattern now, every disaster unfolds along the same grooves worn deep by repetition. The pandemic proved this with brutal clarity: essential workers died while knowledge workers typed from safety, wealth flowed upward while death flowed down, and we called them heroes instead of paying them. The machine doesn&rsquo;t need instructions anymore. It knows what to do.</P>

        <P>The broadcast runs constantly through every platform, every policy, every possibility we might imagine for living differently. Housing costs that devour entire lives. Medical systems that bankrupt the sick for the crime of sickness. Climate catastrophe distributed precisely along the lines of who can afford to escape and who can&rsquo;t. We&rsquo;ve built a civilization on the principle that someone else goes first, bleeds first, breaks first, dies first. Not as conspiracy but as consensus, not as exception but as rule.</P>

        <P>The George Floyd protests revealed how deep this runs. Millions in the streets, genuine rage, genuine possibility, and then watch what happens. The revolution becomes another way to feel engaged while risking nothing, another performance in a culture that has perfected performance as a substitute for transformation. We&rsquo;ll read the books but not change the zoning. We&rsquo;ll post the black squares but not surrender the advantages. We&rsquo;ll say the names but not alter the structures that ensure there will always be more names to say.</P>

        <P>The most horrifying part isn&rsquo;t the inequality or the cruelty or the waste. It&rsquo;s the automation. Nobody needs to enforce this anymore. We enforce it on ourselves, on each other, through ten thousand daily calculations about what&rsquo;s realistic, what&rsquo;s possible, what&rsquo;s worth fighting for. The word &ldquo;sacrifice&rdquo; has structured consciousness so completely that we can&rsquo;t think outside its grammar. Every solution we imagine involves someone else paying the cost. Every future we project assumes the continuation of the present.</P>

        <P>Reality has started presenting bills that can&rsquo;t be forwarded to someone else. The climate doesn&rsquo;t care about our deferrals. The costs are coming due. And still the broadcast continues, still we tune in, still we wait for someone else to go first, to pay first, to die first if necessary. The spell holds because we hold it. Because we&rsquo;ve built entire civilizations on the premise that sacrifice is what other people do.</P>

        <P>Thompson saw it true: eventually the hallucination becomes the world. Eventually you can&rsquo;t tell the difference between the drug and reality because they&rsquo;ve merged, because the distortion has lasted so long it feels like clarity. We live in Nixon&rsquo;s expanded face now, all of us, and we&rsquo;ve lived here so long we&rsquo;ve forgotten it ever had edges, ever had limits, ever had an outside.</P>

        <P>Each generation perfected their own dialect of deferral. The Boomers made it policy. Gen X made it irony. Millennials made it a personal brand. Gen Z made it content. Four generations inside the same broadcast, each finding new ways to perform concern while ensuring someone else bleeds first. The machine doesn&rsquo;t need enforcement anymore; it has something better. It has children raised inside the spell teaching their children that sacrifice is what other people do, that resistance means tweeting harder, that revolution comes with a subscription model.</P>

        <P>The horror isn&rsquo;t that we can&rsquo;t escape Nixon&rsquo;s expanded face. It&rsquo;s that we&rsquo;ve decorated it, made it home, raised families inside it. We&rsquo;ve made the hallucination hereditary.</P>

        <P>Sacrifice, sacrifice, sacrifice.</P>

        <P>Until the word consumes itself. Until there&rsquo;s no one left to defer to. Until the machine finally grinds to a halt on its own extracted emptiness. But probably not today. Probably not us. Probably someone else first.</P>

        <P>Always someone else first.</P>
      </section>
    </div>
  );
}
