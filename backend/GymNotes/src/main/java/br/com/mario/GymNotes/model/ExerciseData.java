package br.com.mario.GymNotes.model;

import java.util.List;

public class ExerciseData {

    private String name;
    private List<SessionData> sessions;

    public ExerciseData(String name, List<SessionData> sessions) {
        this.name = name;
        this.sessions = sessions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SessionData> getSessions() {
        List<SessionData> realSessions = sessions.stream().filter((session) -> session.getVolume() != 0).toList();
        return realSessions;
    }

    public void setSessions(List<SessionData> sessions) {
        this.sessions = sessions;
    }
}
