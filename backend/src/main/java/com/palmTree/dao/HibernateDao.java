package com.palmTree.dao;

import org.hibernate.SessionFactory;

public class HibernateDao
{
	
	private SessionFactory sessionfactory;
	
	public String getUser()
	{	
		return "null";
	}

	public SessionFactory getSessionfactory() {
		return sessionfactory;
	}

	public void setSessionfactory(SessionFactory sessionfactory) {
		this.sessionfactory = sessionfactory;
	}
}
