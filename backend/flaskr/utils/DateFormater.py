from datetime import datetime


class DateFormater:
    @staticmethod
    def dateFormat(date: str):
        date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%m/%d/%Y", "%Y/%m/%d"]

        for date_format in date_formats:
            try:
                parsed_date = datetime.strptime(date, date_format)
                return parsed_date.strftime("%d/%m/%Y")
            except ValueError:
                continue

        raise ValueError("Date format is not recognized. Please use DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY, or YYYY/MM/DD.")
