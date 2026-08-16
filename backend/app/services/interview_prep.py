"""
AI Mock Interview Prep Service
Analyzes ATS Gap Analysis (Missing vs Matched Skills) and Seniority Level
to generate 6 customized interview questions with Interviewer Intent,
STAR Framework answering guides, and essential keywords.
"""

from typing import Dict, List, Optional, Any


# Skill specific deep-dive question templates
TECHNICAL_GAP_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "docker": {
        "question": "How would you containerize a multi-tier service using Docker, and what best practices would you implement to optimize image size and build caching in CI/CD pipelines?",
        "why": "The interviewer wants to evaluate whether you understand container lifecycle, multi-stage builds, layer caching, and lightweight base images for production deployments.",
        "situation": "In a previous project, microservices had environment parity issues between local staging and cloud production.",
        "task": "Migrate services to Docker containers while ensuring rapid build times and minimal image footprints.",
        "action": "Implemented multi-stage Dockerfiles, leveraged Alpine/distroless base images, organized layer caching to place volatile code last, and configured non-root security contexts.",
        "result": "Reduced build image sizes by 65% (from 1.2GB to 140MB) and accelerated CI/CD pipeline build stages from 8 minutes to 90 seconds.",
        "keywords": ["Multi-stage builds", "Docker Compose", "Layer caching", "Distroless images", "Environment parity", "CI/CD integration"],
    },
    "kubernetes": {
        "question": "If our production application experiences sudden traffic spikes, how would you configure Kubernetes auto-scaling, health probes, and zero-downtime rolling updates?",
        "why": "Assesses your practical knowledge of orchestration, HPA (Horizontal Pod Autoscaler), liveness/readiness probes, and resource requests/limits.",
        "situation": "Our backend APIs faced transient downtime during peak marketing events when pod utilization exceeded CPU thresholds.",
        "task": "Configure automated scaling and resilient deployment strategies to guarantee 99.95% uptime.",
        "action": "Defined resource requests/limits, set up Horizontal Pod Autoscaler (HPA) targeting 70% CPU/memory, implemented graceful shutdown hooks with liveness/readiness probes, and used rolling update strategy with maxSurge.",
        "result": "Eliminated 502 gateway errors during peak traffic surges and achieved seamless zero-downtime deployments.",
        "keywords": ["Horizontal Pod Autoscaler (HPA)", "Liveness & Readiness probes", "Rolling updates", "Resource limits", "Ingress controllers", "Helm charts"],
    },
    "aws": {
        "question": "How would you architect a secure, scalable, and cost-effective cloud infrastructure on AWS for this service (e.g. ECS/EKS, S3, RDS, Lambda)?",
        "why": "Evaluates your architectural breadth with AWS services, IAM least-privilege security, VPC networking, and cost optimization.",
        "situation": "Legacy workloads ran on monolithic compute instances with manual scaling and unencrypted storage.",
        "task": "Modernize the infrastructure to a scalable, serverless or containerized architecture on AWS.",
        "action": "Provisioned VPC with public/private subnets, deployed containerized workloads to AWS ECS/Fargate behind an ALB, utilized RDS Multi-AZ for failover, and enforced IAM role-based least privilege.",
        "result": "Lowered monthly cloud infrastructure expenses by 32% while handling 3x higher traffic volumes with automatic failover.",
        "keywords": ["AWS ECS/Fargate", "IAM roles & least privilege", "VPC subnets", "Application Load Balancer", "RDS Multi-AZ", "CloudWatch metrics"],
    },
    "graphql": {
        "question": "How would you address over-fetching and the N+1 query problem when implementing a GraphQL API backend?",
        "why": "Tests understanding of GraphQL resolvers, DataLoader batching mechanisms, and query depth/complexity limiting.",
        "situation": "Client applications were over-fetching nested relational entities, resulting in hundreds of redundant database queries per page load.",
        "task": "Optimize GraphQL query execution and resolve N+1 relational database bottlenecks.",
        "action": "Implemented DataLoader for query batching and in-memory request-level caching, added schema complexity limits, and configured persisted queries.",
        "result": "Decreased database query round-trips by 84% and cut GraphQL endpoint latency from 450ms to 40ms.",
        "keywords": ["DataLoader batching", "N+1 query problem", "Schema complexity analysis", "Resolvers", "Over-fetching reduction"],
    },
    "redis": {
        "question": "How do you determine appropriate caching strategies (e.g. Cache-Aside vs Write-Through) with Redis, and how do you handle cache invalidation and stampedes?",
        "why": "Evaluates practical knowledge of in-memory caching patterns, TTL strategies, distributed locking, and stale data mitigation.",
        "situation": "High-read database endpoints experienced severe locks and slowdowns during frequent repetitive queries.",
        "task": "Integrate Redis caching to offload database reads while ensuring data consistency.",
        "action": "Implemented the Cache-Aside pattern with jittered TTLs to prevent thundering herd / stampede issues, and added Redis distributed locks (Redlock) for critical state updates.",
        "result": "Offloaded 78% of read queries from the primary database, reducing average API response times to under 25ms.",
        "keywords": ["Cache-Aside pattern", "TTL jittering", "Cache stampede prevention", "Distributed locking", "Eviction policies (LRU)"],
    },
    "ci/cd": {
        "question": "Describe how you design a resilient CI/CD pipeline that balances fast developer feedback with thorough automated testing, security scanning, and safe staging deployments.",
        "why": "Interviewer looks for DevOps maturity, testing pyramid knowledge, automated linting, container scanning, and rollback strategies.",
        "situation": "Deployments were executed manually, leading to intermittent regression bugs reaching production.",
        "task": "Automate build, test, security linting, and staged deployment pipelines.",
        "action": "Authored GitHub Actions pipelines featuring parallel unit/integration test suites, Trivy container security scans, and blue-green staging releases with automated canary rollback.",
        "result": "Accelerated release cycle frequency from bi-weekly to multiple daily deployments with 0 major regression outages.",
        "keywords": ["GitHub Actions / GitLab CI", "Blue-green deployment", "Automated test suites", "Canary releases", "Vulnerability scanning"],
    },
    "typescript": {
        "question": "How do you leverage advanced TypeScript features (generics, mapped types, utility types) to enforce compile-time safety and eliminate runtime exceptions across large codebases?",
        "why": "Checks whether you understand strict typing, API contract validation, and maintaining type-safety across distributed full-stack interfaces.",
        "situation": "A dynamically typed codebase frequently suffered from 'undefined is not a function' runtime crashes in production.",
        "task": "Migrate core modules to strict TypeScript and implement shared contract interfaces.",
        "action": "Defined generic repository patterns, utilized Zod for runtime schema validation inferring TypeScript types, and enforced strict compiler flags (noImplicitAny, strictNullChecks).",
        "result": "Eliminated over 90% of type-related runtime errors and improved developer onboarding speed with self-documenting code.",
        "keywords": ["Generics", "Type guards", "Zod schema inference", "Utility types (Pick, Omit, Partial)", "Strict null checks"],
    },
    "rabbitmq": {
        "question": "How would you architect asynchronous task processing with RabbitMQ/Kafka, ensuring message idempotency, dead-letter queueing, and reliable worker ack handling?",
        "why": "Tests distributed systems principles, at-least-once delivery guarantees, retry backoff strategies, and decoupled worker architectures.",
        "situation": "Synchronous HTTP requests for heavy document processing were causing client timeouts and resource starvation.",
        "task": "Decouple heavy tasks into an asynchronous message queue architecture.",
        "action": "Introduced RabbitMQ with topic exchanges, configured manual acknowledgments (ACK/NACK), implemented Dead Letter Queues (DLQ) with exponential backoff retries, and enforced idempotent message handlers.",
        "result": "Supported 10,000+ queued jobs simultaneously without API latency degradation and guaranteed 100% message processing reliability.",
        "keywords": ["Dead Letter Queue (DLQ)", "Message idempotency", "Manual acknowledgments", "Exponential backoff", "Decoupled workers"],
    },
}


def build_star_outline(situation: str, task: str, action: str, result: str) -> Dict[str, str]:
    """Formats STAR framework components into structured dictionary."""
    full_text = (
        f"• Situation: {situation}\n"
        f"• Task: {task}\n"
        f"• Action: {action}\n"
        f"• Result: {result}"
    )
    return {
        "situation": situation,
        "task": task,
        "action": action,
        "result": result,
        "full_outline": full_text,
    }


def generate_interview_questions(
    matched_skills: Optional[List[str]] = None,
    missing_skills: Optional[List[str]] = None,
    target_role: Optional[str] = None,
    seniority_level: Optional[str] = None,
    job_description: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Generates 6 role-tailored interview questions:
      - 3 Technical Gap questions targeting missing ATS skills
      - 2 Scenario / System Design questions calibrated to seniority
      - 1 Behavioral & Leadership question
    """
    role = target_role or "Senior Software Engineer"
    seniority = seniority_level or "Senior"
    missing = [s.strip() for s in (missing_skills or []) if s.strip()]
    matched = [s.strip() for s in (matched_skills or []) if s.strip()]

    # Fallback skills if empty
    if not missing:
        missing = ["Docker", "Kubernetes", "AWS", "Redis"]
    if not matched:
        matched = ["Python", "FastAPI", "PostgreSQL", "React"]

    questions = []
    q_id = 1

    # -------------------------------------------------------------
    # 1-3. Technical Gap Questions (Targeting Missing Skills)
    # -------------------------------------------------------------
    for i in range(min(3, len(missing))):
        skill = missing[i]
        skill_key = skill.lower()
        
        # Match template or generate customized gap question
        if skill_key in TECHNICAL_GAP_TEMPLATES:
            t = TECHNICAL_GAP_TEMPLATES[skill_key]
            q_text = t["question"]
            why_text = t["why"]
            star = build_star_outline(t["situation"], t["task"], t["action"], t["result"])
            keywords = t["keywords"]
        else:
            q_text = f"The job description emphasizes hands-on experience with {skill}. How would you quickly bridge this skill gap and implement {skill} best practices in a production engineering environment?"
            why_text = f"Interviewers ask this to test your learning agility, foundational principles, and how methodically you adopt {skill} without introducing architectural debt."
            star = build_star_outline(
                situation=f"In a previous role, our team needed to integrate {skill} into our tech stack to solve scalability and maintainability requirements.",
                task=f"Rapidly upskill on {skill} architecture, build a working proof-of-concept, and standardize team development workflows.",
                action=f"Reviewed official documentation and architecture patterns for {skill}, implemented automated testing and linting, and created modular abstractions to isolate integration points.",
                result=f"Successfully delivered production integration with {skill} ahead of schedule, with zero critical defects and full team documentation."
            )
            keywords = [f"{skill} Architecture", "Proof of Concept", "Best Practices", "Automated Testing", "Modular Design", "Fast Ramp-up"]

        questions.append({
            "id": q_id,
            "question": q_text,
            "category": "Technical Gap",
            "difficulty": seniority if seniority in ["Senior", "Mid"] else "Mid",
            "targeted_skill": skill,
            "why_interviewer_asks_this": why_text,
            "star_framework_outline": star,
            "keywords_to_mention": keywords,
        })
        q_id += 1

    # Ensure 3 technical questions even if missing list had < 3
    while len(questions) < 3:
        fallback_skill = "Cloud Infrastructure & CI/CD"
        questions.append({
            "id": q_id,
            "question": f"How do you design automated testing, linting, and deployment pipelines to guarantee high code quality for {role} deliverables?",
            "category": "Technical Gap",
            "difficulty": "Mid",
            "targeted_skill": fallback_skill,
            "why_interviewer_asks_this": "Verifies that you write testable, maintainable code backed by automated testing and CI/CD pipelines.",
            "star_framework_outline": build_star_outline(
                situation="Manual testing and inconsistent local setups caused occasional release regressions.",
                task="Establish automated unit and integration testing gates in our build pipeline.",
                action="Integrated pytest/jest test suites into GitHub Actions, enforced 85%+ branch coverage, and added pre-commit linters.",
                result="Decreased post-release defects by 45% and increased developer deployment confidence."
            ),
            "keywords_to_mention": ["CI/CD", "Test Coverage (Unit/Integration)", "Regression Prevention", "Pre-commit Hooks", "Code Quality Gates"],
        })
        q_id += 1

    # -------------------------------------------------------------
    # 4-5. Scenario / System Design Questions (Seniority-Calibrated)
    # -------------------------------------------------------------
    # Scenario 1: Scalability & Throughput
    questions.append({
        "id": q_id,
        "question": f"Design a high-scale, fault-tolerant backend system for {role} that handles 10,000+ requests per second with sub-50ms latency. How do you design the data layer, caching, and rate limiting?",
        "category": "System Design / Architecture",
        "difficulty": seniority,
        "targeted_skill": "System Architecture & High Concurrency",
        "why_interviewer_asks_this": "Evaluates your ability to make sensible engineering trade-offs between latency, data consistency, caching layers, and database scaling under heavy loads.",
        "star_framework_outline": build_star_outline(
            situation=f"Our primary API started facing database contention and connection pool exhaustion when traffic spiked to 8,000+ concurrent users.",
            task="Redesign the architecture to sustain 10k+ req/sec with strict sub-50ms latency guarantees.",
            action="Placed Redis caching with LRU eviction in front of read-heavy routes, added token-bucket rate limiting at the API Gateway, and partitioned PostgreSQL queries with read replicas.",
            result="Maintained P99 latency of 34ms under peak load and prevented database connection saturation."
        ),
        "keywords_to_mention": ["Read Replicas & Indexing", "Redis Cache-Aside", "Token Bucket Rate Limiting", "Connection Pooling", "P99 Latency Optimization", "Stateless API Gateways"],
    })
    q_id += 1

    # Scenario 2: High Availability & Database Migrations
    questions.append({
        "id": q_id,
        "question": "How do you execute zero-downtime database schema migrations on a live production database with millions of active records?",
        "category": "System Design / Architecture",
        "difficulty": seniority,
        "targeted_skill": "Zero-Downtime Database Engineering",
        "why_interviewer_asks_this": "Hiring managers look for practical production experience avoiding table locks, data corruption, and service interruptions during schema evolutions.",
        "star_framework_outline": build_star_outline(
            situation="A major feature release required altering a core database table with 15 million rows without taking the platform offline.",
            task="Perform the schema migration with 0% downtime and full backward compatibility.",
            action="Followed the expand-contract pattern: added new nullable columns, dual-wrote application records via transaction hooks, backfilled historical data asynchronously in batches, and switched reads before deprecating old columns.",
            result="Completed the full migration across 15M records with zero downtime, zero table locking delays, and 100% data integrity."
        ),
        "keywords_to_mention": ["Expand-Contract pattern", "Dual-writing", "Asynchronous batch backfill", "Zero table locks", "Backward compatibility", "Database transactions"],
    })
    q_id += 1

    # -------------------------------------------------------------
    # 6. Behavioral & Leadership Question
    # -------------------------------------------------------------
    questions.append({
        "id": q_id,
        "question": "Tell me about a time when you had a significant technical disagreement with a team member or stakeholder regarding system architecture or deadlines. How did you resolve it?",
        "category": "Behavioral & Leadership",
        "difficulty": "All Levels",
        "targeted_skill": "Technical Conflict Resolution & Cross-Functional Alignment",
        "why_interviewer_asks_this": "Assesses emotional intelligence, communication skills, objective data-driven decision making, and team collaboration under pressure.",
        "star_framework_outline": build_star_outline(
            situation="Our team was split between building a complex distributed microservice architecture vs a modular monolith for a tight Q3 deadline.",
            task="Align the engineering team and product stakeholders on a sustainable path that met both delivery timelines and future scalability needs.",
            action="Facilitated a technical trade-off matrix evaluating build time, operational complexity, and performance; built a rapid 2-day proof of concept demonstrating that a modular monolith with clear domain boundaries delivered 80% of benefits with half the operational overhead.",
            result="Unified the team behind the modular approach, delivered the feature 1 week early, and successfully scaled to 500k active users before splitting isolated services."
        ),
        "keywords_to_mention": ["Objective Trade-off Matrix", "Proof of Concept (PoC)", "Data-driven Decision Making", "Stakeholder Alignment", "Pragmatic Engineering", "Active Listening"],
    })

    return questions


def generate_interview_prep_service(
    matched_skills: Optional[List[str]] = None,
    missing_skills: Optional[List[str]] = None,
    target_role: Optional[str] = None,
    seniority_level: Optional[str] = None,
    job_description: Optional[str] = None,
    resume_text: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Main entrypoint for Interview Prep service.
    Returns structured list of 6 customized questions with STAR answering guides.
    """
    role = target_role or "Senior Software Engineer"
    seniority = seniority_level or "Senior"

    questions = generate_interview_questions(
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        target_role=role,
        seniority_level=seniority,
        job_description=job_description,
    )

    return {
        "success": True,
        "target_role": role,
        "seniority_level": seniority,
        "total_questions": len(questions),
        "questions": questions,
    }
