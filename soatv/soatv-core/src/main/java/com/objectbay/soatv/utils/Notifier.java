package com.objectbay.soatv.utils;

import java.util.Observable;

/**
 * Class implements notification mechanism provided by standard Java Observer/Observable
 * @author eerofeev
 *
 */
public class Notifier extends Observable {
	
	@Override
	public void notifyObservers(Object obj){
		setChanged();
		super.notifyObservers(obj);
		clearChanged();
	}

}
