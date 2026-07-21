"""
Database module — Phase 4 stub.

Phase 1-3 use an in-memory dictionary (_documents in routes.py).
Phase 4 replaces this with SQLite (local) or PostgreSQL (production).

Roadmap:
    from sqlalchemy import create_engine, Column, String, JSON, DateTime
    from sqlalchemy.orm import declarative_base, sessionmaker
    import datetime

    Base = declarative_base()

    class Document(Base):
        __tablename__ = "documents"
        id = Column(String, primary_key=True)
        filename = Column(String)
        fields = Column(JSON)
        confidence = Column(JSON)
        raw_text = Column(String)
        status = Column(String, default="uploaded")
        qr_data = Column(String, nullable=True)
        created_at = Column(DateTime, default=datetime.datetime.utcnow)
"""

# No implementation yet — Phase 4 scope.
# See roadmap section in README.md.
