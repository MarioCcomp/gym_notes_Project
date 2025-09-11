package br.com.mario.GymNotes.model;

import java.time.LocalDate;
import java.util.List;

public class SessionData {
    private LocalDate date;
    private Double volume;
    private List<SetData> sets;

    public SessionData(LocalDate date, List<SetData> sets) {
        this.date = date;
        this.sets = sets;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getVolume() {
        return sets.stream()
                .mapToDouble(set -> {
                    if (set.getKg() == null || set.getReps() == null) {
                        return 0.0; // 
                    }
                    return set.getKg() * set.getReps();
                })
                .sum();
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public List<SetData> getSets() {
        return sets;
    }

    public void setSets(List<SetData> sets) {
        this.sets = sets;
    }
}
