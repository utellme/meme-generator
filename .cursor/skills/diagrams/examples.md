# Diagram Examples

## Flowchart

```mermaid
flowchart TD
    A[Start] --> B{Is valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Error]
    C --> E[End]
    D --> E
```

## Sequence diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database

    C->>S: Request
    S->>DB: Query
    DB-->>S: Results
    S-->>C: Response
```

## Class diagram

```mermaid
classDiagram
    class Animal {
        String name
        makeSound()
    }
    class Dog {
        bark()
    }
    Animal <|-- Dog
```

## ER diagram

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
```

## Architecture with subgraphs

```mermaid
flowchart LR
    subgraph Client
        UI[Web UI]
    end
    subgraph Backend
        API[API Gateway]
        SVC[User Service]
    end
    subgraph Data
        DB[(PostgreSQL)]
    end
    UI --> API
    API --> SVC
    SVC --> DB
```

## Text alternative example

For the sequence diagram above:

```
Client --Request--> Server --Query--> Database
Client <--Response-- Server <--Results-- Database
```
