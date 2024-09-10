using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml.Xsl;
using System.Xml;

public partial class _Default : System.Web.UI.Page
{
    //declarar una variable de alacance global
    public string tipomenu = string.Empty;
    protected void Page_Load(object sender, EventArgs e)
    {
        Label1.Text = "Hola desde el CodeBehind";
        Label1.BackColor = System.Drawing.Color.Red;

        //recuperar una variable desde la URL
        //para ellos valido si existe una variable llamada "Id" dentro de la URL
        //si no existe, pasamos un 0, de lo contrario recupero el valor
        if (Request.QueryString["Id"] == null)
        {
            tipomenu = "0";
        }
        else
        {
            tipomenu = Request.QueryString["Id"];
        }

        TransformarXML();
    }

    private void TransformarXML()
    {
        //recuperamos las rutas de nuestros XML y XSLT
        string xmlPath = ConfigurationManager.AppSettings["FileServer"].ToString() + "xml/menu.xml";
        string xsltPath = ConfigurationManager.AppSettings["FileServer"].ToString() + "xslt/template.xslt";

        //leer el archivo XML (en la parte de arriba, necesitamos los using de "System.Xml")
        XmlTextReader xmlTextReader = new XmlTextReader(xmlPath);

        //Configuramos las credenciales para resolver recursos extgernos como el XSLT
        XmlUrlResolver resolver = new XmlUrlResolver();
        resolver.Credentials = CredentialCache.DefaultCredentials;

        //creamos las configraciones para poder acceder al XSLT
        //los parámtetros "true" son para poder tratar el XSLT como si fuese un documento y así poder transformarlo
        XsltSettings settings = new XsltSettings(true, true);

        //leemos el archivos XSLT y lo cargamos para su transformación
        XslCompiledTransform xslt = new XslCompiledTransform();
        xslt.Load(xsltPath, settings, resolver);

        //Creamos un StringBuilder para almacenar el resultado de la transformación
        StringBuilder stringBuilder = new StringBuilder();
        TextWriter tWritter = new StringWriter(stringBuilder);

        //configramos los argumentos para la transformación del XSLT
        XsltArgumentList xsltArgumentList = new XsltArgumentList();
        //pasamos la variable del tipo menu al XSLT
        xsltArgumentList.AddParam("TipoMenu", "", tipomenu);

        //Transformamos el XML => HTML usando XSLT
        xslt.Transform(xmlTextReader, xsltArgumentList, tWritter);

        //Obtenemos el resultado de la traensformación como una sola cadena
        string resultado = stringBuilder.ToString();

        //Escribimos el resultado como una respuesta HTTP
        Response.Write(resultado);
    }
}