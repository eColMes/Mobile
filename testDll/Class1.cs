using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace testDll
{
    public class Class1
    {
        public string Id { get; set; }
    }
}
function Class1(class1) 
{
	var self = this;
	self.id = ko.observable(class1.id || '');
}

