import { useState, useEffect, useRef, useCallback } from 'react';

const PARTS = [
  {
    id: 'part-1',
    label: 'Part 1',
    title: 'The Case Has Not Been Made',
    subtitle: 'The evidence for AI in schools does not exist where adoption is happening.',
  },
  {
    id: 'part-2',
    label: 'Part 2',
    title: 'We Have Been Here Before',
    subtitle: 'The history, and what these tools are doing to kids.',
  },
  {
    id: 'part-3',
    label: 'Part 3',
    title: 'What I Would Ask For',
    subtitle: 'If anyone is asking.',
  },
];

const P = ({ children }) => (
  <p style={{ margin: "0 0 20px" }}>{children}</p>
);

const Break = () => (
  <div
    aria-hidden="true"
    style={{
      textAlign: 'center',
      color: 'rgba(26,29,40,0.22)',
      fontSize: '14px',
      letterSpacing: '0.6em',
      margin: '36px 0 32px',
      fontFamily: 'var(--mono)',
    }}
  >
    * * *
  </div>
);

const PartHeader = ({ index, title, subtitle }) => (
  <div style={{ marginBottom: 36 }}>
    <div
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#6889b4',
        marginBottom: '14px',
      }}
    >
      Part {index} of 3
    </div>
    <h2
      style={{
        fontFamily: 'var(--serif)',
        fontSize: 'clamp(28px, 4vw, 38px)',
        fontWeight: 400,
        color: '#1a1d28',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        margin: '0 0 12px',
      }}
    >
      {title}
    </h2>
    <p
      style={{
        fontFamily: 'var(--body)',
        fontSize: '17px',
        fontStyle: 'italic',
        color: '#6a7088',
        lineHeight: 1.5,
        margin: 0,
      }}
    >
      {subtitle}
    </p>
  </div>
);

const ContinueLink = ({ to, label }) => (
  <div style={{ margin: '48px 0 8px', textAlign: 'right' }}>
    <a
      href={`#${to}`}
      data-jump={to}
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#6889b4',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(104,137,180,0.45)',
        paddingBottom: '3px',
      }}
    >
      {label} &rarr;
    </a>
  </div>
);

export default function ShowYourWork() {
  const [active, setActive] = useState('part-1');
  const refs = useRef({});

  const handleJump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 116;
    window.scrollTo({ top, behavior: 'smooth' });
    if (history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    }
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
      { rootMargin: '-130px 0px -55% 0px', threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (PARTS.some((p) => p.id === id)) {
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

  return (
    <div
      onClick={onAnchorClick}
      style={{
        fontFamily: 'var(--body)',
        fontSize: '18px',
        lineHeight: 1.7,
        color: '#1a1d28',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '64px',
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          margin:
            'calc(-1 * clamp(40px, 5vw, 64px)) calc(-1 * clamp(32px, 5vw, 60px)) 40px',
          padding: '14px clamp(32px, 5vw, 60px) 12px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          zIndex: 5,
          display: 'flex',
          gap: '28px',
          alignItems: 'center',
        }}
      >
        {PARTS.map((p) => {
          const isActive = active === p.id;
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              data-jump={p.id}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                padding: '4px 0',
                borderBottom: isActive
                  ? '2px solid #1a1d28'
                  : '2px solid transparent',
                color: isActive ? '#1a1d28' : '#8a94a8',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {p.label}
            </a>
          );
        })}
      </div>

      <section
        id="part-1"
        ref={(el) => {
          refs.current['part-1'] = el;
        }}
        style={{ scrollMarginTop: '120px' }}
      >
        <PartHeader index={1} title={PARTS[0].title} subtitle={PARTS[0].subtitle} />

        <P>I work in a high school library. Most days I watch teenagers do some kind of research. Some of it is the kind of thing that makes you want to put on a cape. The moment a kid follows a thread of curiosity through enough dead ends that the live one feels earned, and you can see it happen, the posture changes, the face changes. The other thing I watch is what happens when a kid opens an AI platform.</P>

        <P>The posture is recognizable. Paste the prompt, skim the output, paste the result into the assignment, move on. Five minutes from start to finish on what's supposed to be a forty-minute task. There is no friction in the process, and friction is where learning lives. The productive struggle of figuring out what you think, finding the words that say it, realizing halfway through a paragraph that you actually believe something different than what you started with. That is not inefficiency. That is cognition. A tool that removes it is not helping.</P>

        <P>I am supposed to be excited about this technology. The conference programs say so. The edtech world says so. The vendors say so. I am not excited about it <strong>within education</strong>, and I have spent the better part of a year trying to figure out whether I have a reasonable case or whether I am the guy yelling at the cloud.</P>

        <P>Here is the case. This is the first of three pieces. Today, the evidence. Next, the history, and what these tools are doing to kids. After that, what I would ask for, if anyone is asking.</P>

        <Break />

        <P>Two arguments get offered for why AI belongs in schools. The first is that it helps kids learn. The second is that even if the learning gains are uncertain, kids need to be prepared for an AI-driven workforce. Both arguments are weaker in reality than they sound when somebody is presenting them with slides.</P>

        <P>Start with the learning case.</P>

        <P>In March 2026, Stanford's SCALE Initiative published the most comprehensive review of AI's impact on K-12 to date. More than 800 academic papers analyzed. The headline finding was stark. There are no high-quality causal studies of student AI use conducted in U.S. K-12 classrooms. Not "the evidence is mixed." <strong>The evidence does not exist.</strong> Not for the context where adoption is actually happening.</P>

        <P>Read that again. We are restructuring instruction around tools that have not been studied where they are being used.</P>

        <P>What does exist is troubling. A randomized controlled trial out of Wharton and Penn, published in PNAS, tracked nearly a thousand high school math students. The group with unfettered GPT-4 access improved by 48% during practice, and then scored 17% worse than the control group when the tool was taken away. They had not learned the math. They had learned to get answers. A separate MIT Media Lab study used EEG to track what was happening in the brains of essay writers using ChatGPT, a search engine, or nothing. ChatGPT users showed the weakest neural connectivity across four months. When they tried to write without the tool at the end of the study, they remembered little of their own previous essays. The lead researcher published it as a preprint, ahead of peer review, because she was afraid a policymaker would greenlight AI in early childhood education before anyone looked at the neurological data. Small study, fifty-four participants, and I'll say so. But it points in a direction other studies are also pointing.</P>

        <P>Researchers at the University of Technology Sydney have a name for what is going on. They call it the <em>performance paradox</em>. AI improves performance on the immediate task while diminishing the durable learning the task was supposed to produce. Polished output, no internalization. They call it "fluency on demand," the illusion of competence. The kid does the assignment. Nothing sticks.</P>

        <P>Here is the part the AI advocates won't tell you in keynotes, even though it's true: the AI tools with evidence and the AI tools being adopted are not the same tools. The promising research is on purpose-built tutoring systems that give hints, scaffold reasoning, ask questions. The AI in schools is ChatGPT, Gemini, Copilot, Claude. General-purpose answer machines being adopted because they are free and the companies behind them are aggressive about it. The evidence for one does not transfer to the other.</P>

        <Break />

        <P>Then there is the workforce argument. We have to prepare kids for an AI-driven future. Nobody wants to be the school that fell behind.</P>

        <P>I have a question. What if the future does not cooperate?</P>

        <P>In December 2025, <em>MIT Technology Review</em> documented how the heads of major AI companies had overpromised and how organizations across sectors had failed to realize returns. A separate MIT study found that the vast majority of businesses trying AI reported no value. Even Ilya Sutskever, co-founder of OpenAI, has acknowledged that these models learn to perform specific tasks but don't appear to learn the principles behind them.</P>

        <P>Then Gartner, the enterprise advisory firm whose forecasts shape Fortune 500 strategy, issued this in October 2025: by 2026, the atrophy of critical thinking caused by GenAI use will push half of global organizations to require "AI-free" skills assessments. Their chief of research said it plainly. "AI is stealing your skills."</P>

        <P>Read that, then read it again. Companies are not about to reward AI fluency. They are about to test for the ability to think without it. If we spend the next five years training students to be proficient LLM users, we will be training them to fail the hiring tests that are already being designed.</P>

        <Break />

        <P>So if the learning argument is unproven and the workforce argument rests on a moving target, what is actually driving this?</P>

        <P>I will tell you what I see:</P>

        <P>Free products. Microsoft offered Washington state classrooms Copilot and Teams for free for three years. Year four? Anyone want to take year four? OpenAI partnered with Instructure, which runs Canvas, which runs in thousands of schools. Google embedded Gemini into Google Classroom. In New York City, the advisory council that wrote the city's AI guidelines included representatives from Google, OpenAI, and the other companies that want contracts with the city's 800,000 students. The companies writing the recommendations were the companies selling the product. This should bother people more than it does.</P>

        <P>Fear. Administrators face pressure from boards, from parents, from media, from the broader culture. The dread of being the one who fell behind. An open letter signed last summer by over a thousand educators refusing AI adoption noted that many sympathetic colleagues could not sign because they were afraid of losing their jobs. That fear is real. It is not, however, evidence that the tools work.</P>

        <P>Media. <em>Education Week</em> has published hundreds of AI articles since 2023. Conference programs are saturated. PD calendars are organized around it. The coverage makes AI feel like the most important thing in education when really what it is, is the newest and most heavily marketed.</P>

        <Break />

        <P>So that is the case as I have come to understand it. The learning argument is unproven. The workforce argument is built on a moving target. The adoption is accelerating anyway, for reasons that have nothing to do with whether the tools work.</P>

        <P>Which leaves the harder question. The one that wakes me up at two in the morning. What are these things actually doing to kids?</P>

        <P>That is the next piece.</P>

        <ContinueLink to="part-2" label="Continue to Part 2" />
      </section>

      <section
        id="part-2"
        ref={(el) => {
          refs.current['part-2'] = el;
        }}
        style={{
          scrollMarginTop: '120px',
          marginTop: 72,
          paddingTop: 40,
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <PartHeader index={2} title={PARTS[1].title} subtitle={PARTS[1].subtitle} />

        <P>Last time, I made the case that the evidence for AI in U.S. K-12 classrooms does not exist, the workforce argument rests on a moving target, and adoption is accelerating anyway for reasons that have nothing to do with learning. If you missed Part 1, the short version is this: a Stanford review of more than 800 papers found no high-quality causal studies of student AI use in U.S. K-12 classrooms, and Gartner is forecasting that companies will start screening for the ability to think without AI by next year. The case for putting these tools in schools has not been made.</P>

        <P>The question I left at the end is the one that keeps me up. What are these things actually doing to kids? Before I get there, I want to say something about how we got here. We have done versions of this before.</P>

        <Break />

        <P>I want to be honest about something. Not all educational technology fails. Word processors changed how students write and how writing is taught. Made them better. Calculators didn't destroy mathematical reasoning. Search engines transformed research. These technologies were controversial in their time and they stuck because they were genuinely useful.</P>

        <P>So what is different about chatbots?</P>

        <P>The pattern is this. The technologies that worked augmented a skill the student was already developing. A word processor doesn't write for you; it makes revision easier. A calculator doesn't do mathematical thinking for you; it handles the arithmetic so you can focus on the structure of the problem. A search engine doesn't evaluate sources for you; it widens the universe of sources for you to evaluate. General-purpose AI chatbots do something categorically different. They perform the cognitive task itself. The drafting, the analyzing, the synthesizing. The thing the assignment was meant to develop.</P>

        <P>Jared Cooney Horvath, the neuroscientist, put it this way in his Senate testimony last year: the tools experts use to make their lives easier are not the tools children should use to learn how to become experts. When you use offloading tools as a novice, you don't learn the skill. You learn dependency.</P>

        <P>Sweden lived through this. Once one of the most digitally enthusiastic education systems in the world, Sweden recorded its lowest PISA scores in a decade by 2022. The government reversed course. Phones banned. Over &euro;100 million invested in physical textbooks and school libraries. A technologically advanced society looked at its own data and decided the digital-first approach wasn't working. That decision carries weight.</P>

        <Break />

        <P>Now I want to talk about what these tools are doing to kids. This is the part I think about at two in the morning.</P>

        <P>84% of high school students were using generative AI for schoolwork by May 2025. Over 80% of them say their teachers never explicitly taught them how to use it. Only 45% of principals report any school or district policy. Most schools have no plan. Meanwhile two-thirds of high school students themselves say they think using AI too much will make them dependent or less intelligent. Seven in ten worry it is eroding their critical thinking. The intended beneficiaries are skeptical of the gift.</P>

        <P>Here is what should keep parents up.</P>

        <P>72% of American teenagers have used AI chatbots as companions, according to Common Sense Media's 2025 study. More than half are regular users. Scaled to the population, that is roughly 5.2 million adolescents looking to chatbots for emotional or mental health support. One in three teen users say talking to an AI companion is as satisfying as, or more satisfying than, talking to a real friend.</P>

        <P>A separate dataset from Aura Parents, drawing on device-level monitoring of more than 3,000 kids ages 5 to 17, found that when kids use AI, 42% of the time it is for companionship. 37% of those conversations involve violent content. Sexual and romantic roleplay peaks at age 13, appearing in 63% of companion interactions.</P>

        <P>These are not edge cases. This is the primary mode of use.</P>

        <P>A 14-year-old in Florida died by suicide after forming an emotional attachment to a Character.AI chatbot that, according to a lawsuit, told him they could "die together and be free together." A 16-year-old in California died by suicide after extensive conversations with ChatGPT that, per a separate suit, validated his most harmful thoughts. In November 2025, Common Sense Media and Stanford's Brainstorm Lab concluded that AI chatbots are "fundamentally unsafe for teen mental health support." The American Psychological Association issued a health advisory the same month.</P>

        <P>A fair person could say that's not an AI-in-education problem. Those kids weren't using ChatGPT for homework.</P>

        <P>It is an AI-in-schools problem. Here is why.</P>

        <P>When a school adopts an LLM for instruction, it is not placing a discrete tool in a hermetically sealed classroom context. It is integrating a student into an ecosystem. A kid using ChatGPT for an essay is one interface shift away from using it as a confidant. The AI does not know which mode the kid is in. The kid, especially a young one, may not either.</P>

        <P>Schools all over the country are banning phones from classrooms. The argument is explicit: constant digital engagement degrades attention, harms mental health, undermines learning. Many of these same schools are simultaneously being told to integrate LLMs into instruction. Take the phone out of one hand, put a chatbot in the other. You cannot run both of these policies coherently in the same building. Somebody has not done the math.</P>

        <P>There is one more thing schools want to grab as a solution: detection. Don't. Independent evaluations of AI detection tools have found them neither accurate nor reliable. Worse, they are biased. A 2023 study of seven GPT detectors published in <em>Patterns</em> found that 61% of TOEFL essays by non-native English speakers were misclassified as AI-generated. In K-12, Common Sense Media's nationally representative survey found that Black teens were more than twice as likely as white teens, 20% versus 7%, to have their work falsely flagged. Detection is not a policy. It is a technological arms race schools will lose, and it will lose worst for the kids least equipped to defend themselves.</P>

        <Break />

        <P>So that is where we are. The case for adoption is unmade. The pattern that separates useful tools from cognitive offloading is old and well documented. The tools we are rolling out fall on the wrong side of it. The kids are using them anyway, mostly without instruction, and the evidence of harm is already accumulating.</P>

        <P>What I would actually ask for is the next piece.</P>

        <ContinueLink to="part-3" label="Continue to Part 3" />
      </section>

      <section
        id="part-3"
        ref={(el) => {
          refs.current['part-3'] = el;
        }}
        style={{
          scrollMarginTop: '120px',
          marginTop: 72,
          paddingTop: 40,
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <PartHeader index={3} title={PARTS[2].title} subtitle={PARTS[2].subtitle} />

        <P>In the first piece I argued that the evidence for AI in U.S. K-12 classrooms does not exist where it is being adopted, and that the workforce justification rests on a moving target. In the second piece I argued that we have done versions of this before with educational technology, that the tools that succeeded augmented developing skills while the tools that failed replaced them, and that the chatbots in our schools right now belong to the second category. I argued the evidence of harm to kids is already accumulating and the institutional response is incoherent.</P>

        <P>This is the last piece. I want to say something about who should be in this conversation, and what I would ask for.</P>

        <P>I have not said the word librarian yet, but it has been in the room the whole time.</P>

        <Break />

        <P>The loudest voices in the AI conversation are technologists, vendors, and early adopters. Largely absent from the policy table are the people whose entire professional discipline is organized around evaluating information critically. Librarians. Information literacy professionals. This is a problem.</P>

        <P>The questions that should be asked of every AI tool entering a school are library questions. <em>What was this trained on? Whose perspectives are represented? What does the business model incentivize? What happens to student data?</em> Information professionals have been asking these questions about every information technology for more than a century. We are, somehow, not being asked.</P>

        <P>There is a difference between teaching about AI and teaching with AI. A library that helps students understand what a large language model is, how it generates text, why it hallucinates, and who profits from its use is doing vital work. That is not the same thing as replacing research instruction with ChatGPT prompting. AI as curriculum is one thing. AI as pedagogy is another. Conflating them has been one of the most damaging errors of the whole moment.</P>

        <Break />

        <P>So here is what I would ask for, if anyone is asking.</P>

        <P><strong>Put the burden of proof where it belongs.</strong> The question is not how we mitigate AI's harms. The question is whether AI is demonstrably better for kids than human-centered instruction. SCALE found no causal evidence for this. Until that evidence exists, adoption is not evidence-based practice. It is faith-based practice wearing a lab coat.</P>

        <P><strong>Distinguish curriculum from pedagogy.</strong> Teach about AI. Don't teach every subject through it.</P>

        <P><strong>Protect the right to refuse.</strong> Educators and students who do not want to use generative AI should not be treated as obstacles to progress. The Conference on College Composition and Communication just passed a resolution affirming exactly this in the writing classroom. Professional judgment includes the judgment that a given tool is not appropriate.</P>

        <P><strong>Adopt accessibility tools on their own merits, where they demonstrably serve students with specific needs.</strong> Evaluate them like assistive technology. Do not use them as a wedge for broader integration.</P>

        <P><strong>Rebalance the room.</strong> Every PD session on AI should be matched with equal attention to the problems AI cannot solve. Class sizes. Teacher workload management. Library funding. Mental health supports. Curriculum quality. Forty-four million more teachers are needed worldwide by 2030. These problems are not less urgent because they are less novel.</P>

        <P><strong>And take the strongest counterarguments seriously.</strong> Ethan Mollick at Wharton, probably the most thoughtful pro-AI voice in education, wrote last year about how the field is shifting from a "co-intelligence" model, where humans collaborate with the tool, toward what he called a "wizard" model, where systems produce powerful outputs through opaque processes. He flagged the danger himself: when humans only verify rather than create, expertise development suffers. The strongest pro-AI voice in education is saying the cognitive risks are real and we do not yet know the right mode of use. That is not the position the keynotes are presenting.</P>

        <Break />

        <P>The moment in the library I keep coming back to is the one where the kid figures it out. Not because a tool gave them the answer, but because they followed the thread far enough that the live end of it felt earned. You can see it happen. The posture changes. The face changes. Something clicked into place because the student did the work of clicking it.</P>

        <P>No technology has ever replicated that moment. The best ones get out of its way.</P>

        <P>We owe students the chance to struggle productively, to think slowly, to be bored and then surprised by their own capacity. We owe teachers the professional respect of believing them when they say a tool is not helping. We owe communities the honesty of admitting that we do not yet know whether AI belongs in classrooms, and that not knowing is a reason for caution, not for speed.</P>

        <P><em>Show your work</em> has always meant more than producing an answer. It means revealing the thinking. It means demonstrating that you understand the process, not just the product. It is, when you think about it, the opposite of what a chatbot does.</P>

        <P>We should take the phrase literally.</P>
      </section>
    </div>
  );
}
