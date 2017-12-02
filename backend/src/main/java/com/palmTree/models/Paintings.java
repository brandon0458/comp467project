package com.palmTree.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Paintings {
	
	@Column(name = "title")
	private String title;
	@Column(name = "date")
	private String date;
	@Column(name = "description")
	private int description;
	@Column(name = "file")
	private String file;
	
	
	
	
	
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public int getDescription() {
		return description;
	}
	public void setDescription(int description) {
		this.description = description;
	}
	public String getFile() {
		return file;
	}
	public void setFile(String file) {
		this.file = file;
	}
	

}
